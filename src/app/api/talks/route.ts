import { createErrorResponse } from '@/lib/apiServer/createErrorResponse';
import { createHotcookRecipe } from '@/lib/apiServer/createHotCookRecipe';
import { requireUserId } from '@/lib/apiServer/requireUserId';
import { numberSchema } from '@/lib/schema/numberSchema';
import {
  openAIRequestSchema,
  type RecentMessage,
} from '@/lib/schema/openAISchema';
import {
  saveRecipeTags,
  upsertTalkKeywords,
} from '@/lib/services/saveAiKeyword';
import { prisma } from '@/lib/utils/prisma';
import { cleanKeywordsPairs } from '@/lib/validators/cleanKeywordsPairs';
import { sanitize, substantial } from '@/lib/validators/contentProcessor';
import { Prisma, TalkSender } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserId(request);
    if (!userId) {
      return createErrorResponse('UNAUTHORIZED', 401);
    }

    const body = await request.json();

    const parsed = openAIRequestSchema.parse(body);
    const { talkRoomId, content } = parsed;
    // TODO: 画像入力対応時はcontentがnullになる可能性あり。
    // Zod / Request型 / OpenAI送信ロジックを見直す（imageKey等）

    const sanitizedInput = sanitize(content);

    if (!substantial(sanitizedInput)) {
      return createErrorResponse('INVALID_FORMAT', 400);
    }

    const pastTalks = await prisma.talk.findMany({
      where: { talkRoomId },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    const recentMessages: RecentMessage = [...pastTalks]
      .reverse()
      .map((talk) => {
        const role = talk.sender === TalkSender.CHEF ? 'assistant' : 'user';

        // 値がない場合も0文字のstringに揃えて連結しやすくし、結果を変えない値として使う
        const recipeSnapshotText = talk.recipeSnapshot
          ? JSON.stringify(talk.recipeSnapshot)
          : '';
        const afterRecipeContent = talk.afterRecipeContent ?? '';

        return {
          role,
          content:
            role === 'assistant'
              ? `${talk.content} ${recipeSnapshotText ? `\n${recipeSnapshotText}` : ''}
                ${afterRecipeContent ? `\n${afterRecipeContent}` : ''}`
              : talk.content,
        };
      });
    // TODO: 画像時、要約処理対応

    const {
      beforeRecipe,
      afterRecipe,
      recipe: generatedRecipe,
    } = await createHotcookRecipe({
      content: sanitizedInput,
      recentMessages,
    });

    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        await tx.talk.create({
          data: {
            talkRoomId,
            content,
            sender: TalkSender.USER,
            isReciped: false,
            deleted: false,
          },
        });

        await tx.talk.create({
          data: {
            talkRoomId,
            content: beforeRecipe,
            recipeSnapshot: generatedRecipe ?? undefined, // Json?はnullを渡せないため、なしの場合は値を渡さない
            afterRecipeContent: afterRecipe,
            sender: TalkSender.CHEF,
            isReciped: generatedRecipe !== null,
            deleted: false,
          },
        });

        if (!generatedRecipe) {
          return null;
        }

        const recipe = await tx.recipe.create({
          data: {
            title: generatedRecipe['title'],
            point: generatedRecipe['point'],
            cookingTime: generatedRecipe['cookingTime'],
            ingredients: generatedRecipe['ingredients'],
            instructions: generatedRecipe['instructions'],
            createdByUser: userId,
            talkRoomId,
          },
        });

        const keywordPairs = cleanKeywordsPairs(generatedRecipe.keywords);

        return {
          recipeId: recipe.id,
          keywordPairs,
        };
      }
    );

    if (result && result.keywordPairs.length) {
      const sideEffects = [
        {
          name: 'upsertTalkKeywords',
          promise: upsertTalkKeywords(userId, result.keywordPairs),
        },
        {
          name: 'saveRecipeTags',
          promise: saveRecipeTags(result.recipeId, result.keywordPairs),
        },
      ];

      // allSettledは各副処理の成功/失敗結果どちらも入る
      const sideEffectResults = await Promise.allSettled(
        sideEffects.map((sideEffect) => sideEffect.promise)
      );

      // Promise<void>のため成功時valueは使わず、失敗時だけログに残す
      sideEffectResults.forEach((sideEffectResult, index) => {
        if (sideEffectResult.status === 'rejected') {
          console.error('[Talk API] POST keyword side effect error', {
            name: sideEffects[index].name,
            reason: sideEffectResult.reason,
            userId,
            recipeId: result.recipeId,
            keywordPairs: result.keywordPairs,
          });
        }
      });
    }

    return NextResponse.json({}, { status: 200 });
  } catch (e) {
    if (e instanceof ZodError) {
      console.error('[Talk API] POST Validation failed', e);
      return createErrorResponse('INVALID_FORMAT', 400);
    }

    if (e instanceof Error) {
      if (e.message === 'QUOTA_EXCEEDED') {
        return createErrorResponse('QUOTA_EXCEEDED', 429);
      }
      if (e.message === 'FORBIDDEN') {
        return createErrorResponse('FORBIDDEN', 403);
      }
      if (e.message === 'AI_ERROR') {
        return createErrorResponse('AI_ERROR', 500);
      }
      console.error('[Talk API] POST AI error', e);
    }
    console.error('[Talk API] POST Unexpected error', e);
    return createErrorResponse('INTERNAL_SERVER_ERROR', 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await requireUserId(request);
    if (!userId) {
      return createErrorResponse('UNAUTHORIZED', 401);
    }

    const { searchParams } = new URL(request.url);
    const talkRoomId = numberSchema.parse(searchParams.get('talkRoomId'));

    const talkRoom = await prisma.talkRoom.findFirst({
      where: {
        id: talkRoomId,
        userId,
      },
    });
    if (!talkRoom) {
      return createErrorResponse('TALK_NOT_FOUND', 404);
    }

    const talks = await prisma.talk.findMany({
      where: { talkRoomId },
      orderBy: { id: 'desc' },
      take: 30,
    });

    const displayOrderdTalks = talks.slice().reverse();

    return NextResponse.json(displayOrderdTalks);
  } catch (e) {
    if (e instanceof ZodError) {
      console.error('[Talk API] GET Validation failed', e);
      return createErrorResponse('INVALID_FORMAT', 400);
    }
    console.error('[Talk API] GET Unexpected error', e);
    return createErrorResponse('INTERNAL_SERVER_ERROR', 500);
  }
}
