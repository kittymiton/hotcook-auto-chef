import { getDbUserIdFromToken } from '@/lib/apiServer/auth';
import { extractJsonBlock } from '@/lib/parser/extractJsonBlock';
import { prisma } from '@/lib/utils/prisma';
import { TalkSender } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

/**
 * メッセージ表示に関わるリクエストを処理するAPI
 * POST、GET
 * @param request - Next.jsのRequestオブジェクト
 * @returns {Promise<NextResponse<any>>} 結果を含むJSONレスポンス
 **/
export const POST = async (request: NextRequest) => {
  try {
    const userId = await getDbUserIdFromToken(request); // トークンから取得
    const { content, talkRoomId, sender } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Token is invalid' }, { status: 401 });
    }

    if (!talkRoomId) {
      return NextResponse.json(
        { error: 'Invalid talkRoomId' },
        { status: 400 }
      );
    }

    let isReciped = false;
    const block = extractJsonBlock(content);
    let recipeObj: any = null; // DB保存のための最低限の判定

    if (block) {
      try {
        recipeObj = JSON.parse(block.inner);
        // レシピ保存判定
        if (
          sender === 'chef' && // フロントからリクエストボディで渡ってきた値で判定
          typeof recipeObj['レシピタイトル'] === 'string' &&
          recipeObj['レシピタイトル'].trim() !== ''
        ) {
          isReciped = true;
        }
      } catch (err) {
        isReciped = false;
      }
    }

    await prisma.talk.create({
      data: {
        talkRoomId, // リレーションのキー
        content,
        sender: sender === 'user' ? TalkSender.USER : TalkSender.CHEF, // 正規化でenumに一致
        isReciped: !!isReciped,
        deleted: false,
      },
    });

    if (isReciped && recipeObj) {
      try {
        await prisma.recipe.create({
          data: {
            title: recipeObj['レシピタイトル'],
            point: recipeObj['ポイント'] ?? '',
            cookingTime: recipeObj['調理時間'] ?? '',
            ingredients: JSON.stringify(recipeObj['材料（2人分）'] ?? []),
            instructions: JSON.stringify(recipeObj['作り方'] ?? []),
            createdByUser: userId,
          },
        });
      } catch (err) {
        console.error('レシピ保存エラー:', err);
      }
    }

    return NextResponse.json({ message: 'ok' });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
};

// 会話履歴があれば取得してクライアントに返す
export const GET = async (request: NextRequest) => {
  try {
    const userId = await getDbUserIdFromToken(request); // トークンから取得
    const { searchParams } = new URL(request.url);
    const talkRoomId = searchParams.get('talkRoomId');

    if (!userId) {
      return NextResponse.json({ error: 'Token is invalid' }, { status: 401 });
    }

    if (!talkRoomId) {
      return NextResponse.json(
        { error: 'talkRoomId is required' },
        { status: 400 }
      );
    }

    // 直たたき防止　認可チェック
    const room = await prisma.talkRoom.findFirst({
      where: {
        id: Number(talkRoomId),
        userId,
      },
    });

    if (!room) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const talked = await prisma.talk.findMany({
      where: {
        talkRoomId: Number(talkRoomId),
        talkRoom: {
          userId, // 他のユーザーのトーク取得をブロック　talkRoomIdが露出している為talkRoomIdの指定だけでは取得したいIDが見えるので明示的にuserIdを指定
        },
      },
      orderBy: {
        id: 'desc',
      },
      take: 30, // 打ち切り
    });

    return NextResponse.json({ talked });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
