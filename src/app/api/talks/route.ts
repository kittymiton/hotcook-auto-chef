import { createHotcookRecipe } from '@/lib/apiServer/createHotCookRecipe';
import { requireUserId } from '@/lib/apiServer/requireUserId';
import { recipeBlockForParse } from '@/lib/parser/recipeBlockForParse';
import { prisma } from '@/lib/utils/prisma';
import { normalizeForAI } from '@/lib/validators/normalizeForAI';
import { numberSchema } from '@/lib/validators/numberSchema';
import { openAIRequestSchema } from '@/lib/validators/openAISchema';
import { OpenAIChatRequest } from '@/types/api';
import { Prisma, TalkSender } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const userId = await requireUserId(request);
    if (!userId) {
      console.error('POST /api/talk auth failed - userId missing');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    const recipeObj = recipeBlockForParse(chefContent);

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

    return NextResponse.json({}, { status: 200 });
  } catch (e) {
    if (e instanceof ZodError) {
      console.error('POST /api/talk validation failed', e);
      return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
    }

    console.error('POST /api/talk unexpected error', e);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await requireUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }

    const talks = await prisma.talk.findMany({
      where: { talkRoomId },
      orderBy: { id: 'desc' },
      take: 30,
    });

    return NextResponse.json(talks);
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
