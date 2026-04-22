import { supabase } from '@/lib/utils/env';
import { prisma } from '@/lib/utils/prisma';
import type { InitUserContextRequest } from '@/types/auth';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const authHeader = request.headers.get('Authorization') ?? '';

  if (!authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 });
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
    console.error('[UserRoom API] POST Unexpected error', e);

    return NextResponse.json(
      { message: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
};

export const GET = async (request: NextRequest) => {
  const authHeader = request.headers.get('Authorization') ?? '';

  if (!authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await supabase.auth.getUser(token);
  if (!data.user || error) {
    return NextResponse.json({ message: error }, { status: 400 });
  }

  const supabaseUserId = data.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { supabaseUserId },
    });

    if (!user) {
      return NextResponse.json({ message: 'USER_NOT_FOUND' }, { status: 404 });
    }

    const talkRoom = await prisma.talkRoom.findUnique({
      where: { userId: user.id },
    });

    if (!talkRoom) {
      return NextResponse.json({ message: 'ROOM_NOT_FOUND' }, { status: 404 });
    }

    return NextResponse.json({ talkRoom });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json({ message: e.message }, { status: 400 });
    }
    console.error('[UserRoom API] GET Unexpected error', e);

    return NextResponse.json(
      { message: 'INTERNAL_SERVER_ERROR' },
      { status: 500 }
    );
  }
};
