import { getDbUserIdFromToken } from '@/lib/apiServer/auth';
import { prisma } from '@/lib/utils/prisma';
import { NextRequest, NextResponse } from 'next/server';

/**
 * メッセージ表示に関わるリクエストを処理するAPI
 * POST、GET
 * @param request - Next.jsのRequestオブジェクト
 * @returns {Promise<NextResponse<any>>} 結果を含むJSONレスポンス
 **/
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
