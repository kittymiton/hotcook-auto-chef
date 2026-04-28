import { createErrorResponse } from '@/lib/apiServer/createErrorResponse';
import { supabase } from '@/lib/utils/env';
import { prisma } from '@/lib/utils/prisma';
import type { InitUserContextRequest } from '@/types/auth';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (request: NextRequest) => {
  const authHeader = request.headers.get('Authorization') ?? '';

  if (!authHeader.startsWith('Bearer ')) {
    return createErrorResponse('UNAUTHORIZED', 401);
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const { error } = await supabase.auth.getUser(token);
  if (error) {
    return createErrorResponse('INVALID_FORMAT', 400);
  }

  try {
    const raw = await request.json();
    const body: InitUserContextRequest = {
      supabaseUserId: raw.supabaseUserId,
      email: raw.email,
    };
    const { supabaseUserId, email } = body;

    if (!supabaseUserId || !email) {
      return createErrorResponse('INVALID_FORMAT', 400);
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
      console.error('[UserRoom API] POST Validation failed', e);
      return createErrorResponse('INVALID_FORMAT', 400);
    }
    console.error('[UserRoom API] POST Unexpected error', e);
    return createErrorResponse('INTERNAL_SERVER_ERROR', 500);
  }
};

export const GET = async (request: NextRequest) => {
  const authHeader = request.headers.get('Authorization') ?? '';

  if (!authHeader.startsWith('Bearer ')) {
    return createErrorResponse('UNAUTHORIZED', 401);
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const { data, error } = await supabase.auth.getUser(token);
  if (!data.user || error) {
    return createErrorResponse('UNAUTHORIZED', 401);
  }

  const supabaseUserId = data.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { supabaseUserId },
    });

    if (!user) {
      return createErrorResponse('NOT_FOUND', 404);
    }

    const talkRoom = await prisma.talkRoom.findUnique({
      where: { userId: user.id },
    });

    if (!talkRoom) {
      return createErrorResponse('NOT_FOUND', 404);
    }

    return NextResponse.json({ talkRoom });
  } catch (e) {
    if (e instanceof Error) {
      console.error('[UserRoom API] GET Validation failed', e);
      return createErrorResponse('INVALID_FORMAT', 400);
    }
    console.error('[UserRoom API] GET Unexpected error', e);
    return createErrorResponse('INTERNAL_SERVER_ERROR', 500);
  }
};
