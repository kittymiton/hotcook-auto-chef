import { getDbUserIdFromToken } from '@/lib/apiServer/auth';
import { createHotcookRecipe } from '@/lib/apiServer/createHotCookRecipe';
import { extractJsonBlock } from '@/lib/parser/extractJsonBlock';
import { prisma } from '@/lib/utils/prisma';
import { filterInput } from '@/lib/validators/filterInput';
import type { ChatMessage, OpenAIRequest, OpenAIResponse } from '@/types/api';
import type { ParsedRecipe } from '@/types/recipe';
import { Prisma, Talk, TalkSender } from '@prisma/client';
import { NextResponse } from 'next/server';

/**
 * OpenAIへのリクエストを仲介するPOST APIエンドポイント
 * - 入力のバリデーション後OpenAI APIへ送信
 * - 応答をパースして正規化（マッピング）し、DB保存とフロントへの返却を行う
 * @param request - NextのRequestオブジェクト
 * @returns {Promise<NextResponse>} OpenAI応答を含むレスポンス
 */
export async function POST(
  request: Request
): Promise<NextResponse<OpenAIResponse | { error: string }>> {
  try {
    // --- 1. 認証とユーザー特定 ---
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
    const { content, talkRoomId }: OpenAIRequest = await request.json();

    // --- 3. 過去ログ取得と整形 ---
    const pastTalks = await prisma.talk.findMany({
      where: { talkRoomId },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    const recentMessages: ChatMessage[] = [...pastTalks]
      .reverse() // 新しい順(desc)で取得したので、古い順に戻す
      .map((talk) => ({
        role: talk.sender === TalkSender.CHEF ? 'assistant' : 'user',
        content: String(talk.content),
      }));

    // ユーザー入力のみ安全チェック
    const inputError = filterInput(content);
    if (inputError) {
      return NextResponse.json({ error: inputError }, { status: 400 });
    }

    // --- 4. OpenAI呼び出し ---
    const { content: chefContent } = await createHotcookRecipe({
      content,
      recentMessages,
    });

    // --- 5. パースとレシピ判定---
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

    // --- 6. トランザクションで一括保存 ---
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // (1) ユーザーの発言を保存
      await tx.talk.create({
        data: {
          talkRoomId,
          content: content,
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

      savedTalk = chefTalkRecord as unknown as Talk;

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

    // --- 7. フロントエンドへのResponse ---
    const responseBody: OpenAIResponse = {
      talk: savedTalk!,
      recipeId: savedRecipeId, // なければundefined
    };
    return NextResponse.json(responseBody);
  } catch (err) {
    console.error('通信エラー:', err);
    return NextResponse.json(
      { error: 'AIからの応答が空です' },
      { status: 500 }
    );
  }
}
