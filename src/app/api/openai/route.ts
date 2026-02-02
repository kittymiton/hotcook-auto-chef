import { getDbUserIdFromToken } from '@/lib/apiServer/auth';
import { createHotcookRecipe } from '@/lib/apiServer/createHotCookRecipe';
import { findRecipeBlockForParse } from '@/lib/parser/findRecipeBlockForParse';
import { prisma } from '@/lib/utils/prisma';
import { normalizeForAI } from '@/lib/validators/normalizeForAI';
import { openAIRequestSchema } from '@/lib/validators/openAIRequestSchema';
import type { OpenAIChatRequest } from '@/types/api';
import { Prisma, TalkSender } from '@prisma/client';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization') ?? '';
    if (!token) {
      return NextResponse.json({ error: '認証エラー' }, { status: 401 });
    }

    const userId = await getDbUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsed = openAIRequestSchema.parse(body);
    const { talkRoomId } = parsed;
    const userInput = normalizeForAI(parsed.content);
    // TODO: 画像入力対応時はcontentがnullになる可能性あり。
    // Zod / Request型 / OpenAI送信ロジックを見直す（imageKey等）

    const pastTalks = await prisma.talk.findMany({
      where: { talkRoomId },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    const recentMessages: OpenAIChatRequest[] = [...pastTalks]
      .reverse()
      .map((talk) => {
        const role = talk.sender === TalkSender.CHEF ? 'assistant' : 'user';
        return {
          role,
          content: talk.content,
        };
      });

    const { content: chefContent } = await createHotcookRecipe({
      content: userInput,
      recentMessages,
    });

    const recipeObj = findRecipeBlockForParse(chefContent);

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.talk.create({
        data: {
          talkRoomId,
          content: userInput,
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

    return NextResponse.json({});
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error: 'リクエストが不正です', details: e.issues },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}
