import { supabase } from '@/lib/utils/env';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

/**
 * ユーザー登録＋トークルーム取得を1つのAPIで処理するAPIエンドポイント
 * POST - ユーザー登録/取得、ルーム登録/取得
 * 1.セッションのuser.idを元にユーザーを検索
 * 2.なければ登録
 * 3.トークルームを検索
 * 4.なければ作成
 * 5最終的にトークルームIDを返す
 * @return {Promise<NextResponse<any>>} - レスポンスオブジェクト
 **/
const prisma = new PrismaClient();

export const POST = async (
  request: NextRequest
): Promise<NextResponse<any>> => {
  const access_token = request.headers.get('Authorization') ?? '';

  const { error } = await supabase.auth.getUser(access_token);
  if (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }

  try {
    const { supabaseUserId, email } = await request.json();
    if (!supabaseUserId || !email) {
      return NextResponse.json(
        { error: 'データが存在しません' },
        { status: 400 }
      );
    }

    const user =
      (await prisma.user.findUnique({
        where: { supabaseUserId },
      })) ??
      (await prisma.user.create({
        data: {
          supabaseUserId,
          name: email.split('@')[0],
        },
      }));

    const userId = user.id;

    // userIdをキーとしてtalkRoomからレコードを探す
    const talkRoom =
      (await prisma.talkRoom.findUnique({
        where: { userId },
      })) ??
      (await prisma.talkRoom.create({
        data: {
          userId,
          title: '',
          isReciped: false,
          deleted: false,
        },
      }));

    return NextResponse.json({
      message: 'ユーザー登録とトークルームを作成しました',
      talkRoom,
    });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ message: e.message }, { status: 400 });
    }
    return NextResponse.json({ message: '予期しないエラー' }, { status: 500 });
  }
};
