import { createErrorResponse } from '@/lib/apiServer/createErrorResponse';
import { createHotcookRecipe } from '@/lib/apiServer/createHotCookRecipe';
import { requireUserId } from '@/lib/apiServer/requireUserId';
import { extractedRecipeBlock } from '@/lib/parser/extractedRecipeBlock';
import { recipeBlockForParse } from '@/lib/parser/recipeBlockForParse';
import { numberSchema } from '@/lib/schema/numberSchema';
import { openAIRequestSchema } from '@/lib/schema/openAISchema';
import { updateTalkKeyword } from '@/lib/services/updateTalkKeyword';
import { prisma } from '@/lib/utils/prisma';
import { sanitize, substantial } from '@/lib/validators/contentProcessor';
import { OpenAIChatRequest } from '@/types/api';
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

    const skipRecipeJson = (content: string) => {
      const extracted = extractedRecipeBlock(content);
      if (!extracted) return content;
      return content.replace(extracted.block, '').trim();
    };
    // TODO: 画像時、要約処理対応

    const recentMessages: OpenAIChatRequest[] = [...pastTalks]
      .reverse()
      .map((talk) => {
        const role = talk.sender === TalkSender.CHEF ? 'assistant' : 'user';
        return {
          role,
          content:
            role === 'assistant' ? skipRecipeJson(talk.content) : talk.content,
        };
      });

    const { content: chefContent } = await createHotcookRecipe({
      content: sanitizedInput,
      recentMessages,
    });

    const recipeObj = recipeBlockForParse(chefContent);

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
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
          content: chefContent,
          sender: TalkSender.CHEF,
          isReciped: recipeObj !== null,
          deleted: false,
        },
      });

      if (recipeObj) {
        await tx.recipe.create({
          data: {
            title: recipeObj['レシピタイトル'],
            point: recipeObj['ポイント'],
            cookingTime: recipeObj['調理時間'],
            ingredients: JSON.stringify(recipeObj['材料（2人分）']),
            instructions: JSON.stringify(recipeObj['作り方']),
            createdByUser: userId,
          },
        });
      }
    });

    if (recipeObj) {
      const { keywords } = recipeObj;

      updateTalkKeyword(userId, keywords).catch((err) =>
        console.error('[Talk API] POST keyword update error', err)
      );
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
      return createErrorResponse('NOT_FOUND', 404);
    }

    const talks = await prisma.talk.findMany({
      where: { talkRoomId },
      orderBy: { id: 'desc' },
      take: 30,
    });

    return NextResponse.json(talks);
  } catch (e) {
    if (e instanceof ZodError) {
      console.error('[Talk API] GET Validation failed', e);
      return createErrorResponse('INVALID_FORMAT', 400);
    }
    console.error('[Talk API] GET Unexpected error', e);
    return createErrorResponse('INTERNAL_SERVER_ERROR', 500);
  }
}
