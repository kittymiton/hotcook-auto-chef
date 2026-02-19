import { supabase } from '@/lib/utils/env';
import { prisma } from '@/lib/utils/prisma';
import type { InitUserContextRequest } from '@/types/auth';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const authHeader = request.headers.get('Authorization') ?? '';
  if (!authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.replace('Bearer ', '');

  const { error } = await supabase.auth.getUser(token);
  if (error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }

  try {
    const raw = await request.json();
    const body: InitUserContextRequest = {
      supabaseUserId: raw.supabaseUserId,
      email: raw.email,
    };
    const { supabaseUserId, email } = body;

    if (!supabaseUserId || !email) {
      return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
    }
    // TODO: リファクタでZod検証

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
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
};
