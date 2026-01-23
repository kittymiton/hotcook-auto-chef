import { getDbUserIdFromToken } from '@/lib/apiServer/auth';
import { createHotcookRecipe } from '@/lib/apiServer/createHotCookRecipe';
import { extractJsonBlock } from '@/lib/parser/extractJsonBlock';
import { prisma } from '@/lib/utils/prisma';
import { normalizeForAI } from '@/lib/validators/normalizeForAI';
import { openAIRequestSchema } from '@/lib/validators/openAIRequestSchema';
import type { OpenAIChatRequest, OpenAISuccessResponse } from '@/types/api';
import type { ParsedRecipe } from '@/types/recipe';
import { Prisma, Talk, TalkSender } from '@prisma/client';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function POST(request: Request) {
  try {
    // --- 1. 認証とユーザー特定 ---共通関数にする
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

    // --- 2. Request Body抽出 ---
    const body = await request.json();
    const parsed = openAIRequestSchema.parse(body);
    const { talkRoomId } = parsed;
    const userInput = normalizeForAI(parsed.content);
    // TODO: 画像入力対応時はcontentがnullになる可能性あり。
    // Zod / Request型 / OpenAI送信ロジックを見直す（imageKey等）

    // --- 3. 過去ログ取得 ---
    const pastTalks = await prisma.talk.findMany({
      where: { talkRoomId },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    // --- 4. コンテキスト生成（DB → OpenAIのmessages形式） ---
    const recentMessages: OpenAIChatRequest[] = [...pastTalks]
      .reverse()
      .map((talk) => {
        const role = talk.sender === TalkSender.CHEF ? 'assistant' : 'user';
        return {
          role,
          content: talk.content,
        };
      });

    // --- 5. OpenAI呼び出し ---
    const { content: chefContent } = await createHotcookRecipe({
      content: userInput,
      recentMessages,
    });

    // --- 6. パースとレシピ判定---
    let isReciped = false;
    let recipeObj: ParsedRecipe | null = null;
    const block = extractJsonBlock(chefContent);

    if (block) {
      try {
        const parsed = JSON.parse(block.inner);

        const cleanRecipe: ParsedRecipe = {
          レシピタイトル: String(parsed['レシピタイトル'] || ''),
          ポイント: String(parsed['ポイント'] || ''),
          調理時間: String(parsed['調理時間'] || ''),
          '材料（2人分）': Array.isArray(parsed['材料（2人分）'])
            ? parsed['材料（2人分）']
            : [],
          作り方: Array.isArray(parsed['作り方']) ? parsed['作り方'] : [],
        };

        const hasTitle = cleanRecipe['レシピタイトル'] !== '';
        const hasIngredients = cleanRecipe['材料（2人分）'].length > 0;
        const hasInstructions = cleanRecipe['作り方'].length > 0;

        if (hasTitle && hasIngredients && hasInstructions) {
          recipeObj = cleanRecipe;
          isReciped = true;
        }
      } catch (err) {
        isReciped = false;
      }
    }

    let savedTalk: Talk;
    let savedRecipeId: number | undefined;

    // --- 7. トランザクションで一括保存 ---
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // (1) ユーザーの発言を保存
      await tx.talk.create({
        data: {
          talkRoomId,
          content: userInput,
          sender: TalkSender.USER,
          isReciped: false,
          deleted: false,
        },
      });

      // (2) AIの返答を保存
      const chefTalkRecord = await tx.talk.create({
        data: {
          talkRoomId,
          content: chefContent,
          sender: TalkSender.CHEF,
          isReciped: !!isReciped,
          deleted: false,
        },
      });

      savedTalk = chefTalkRecord;

      // (3) レシピがあれば保存
      if (isReciped && recipeObj) {
        const recipeRecord = await tx.recipe.create({
          data: {
            title: recipeObj['レシピタイトル'],
            point: recipeObj['ポイント'],
            cookingTime: recipeObj['調理時間'],
            ingredients: JSON.stringify(recipeObj['材料（2人分）']),
            instructions: JSON.stringify(recipeObj['作り方']),
            createdByUser: userId,
          },
        });

        savedRecipeId = recipeRecord.id;
      }
    });

    // --- 8. フロントエンドへのResponse ---
    const successData: OpenAISuccessResponse = {
      talk: savedTalk!,
      recipeId: savedRecipeId,
    };

    return NextResponse.json<OpenAISuccessResponse>(successData);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: 'リクエストが不正です', details: err.issues },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}
