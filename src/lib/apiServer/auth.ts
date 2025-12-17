import { supabase } from '@/lib/utils/env';
import { prisma } from '@/lib/utils/prisma';
import { NextRequest } from 'next/server';

/**
 * 認証トークンからDBのユーザーID(Int)を取得するヘルパー関数
 * トークン検証済みのuserIdのみを使用する
 * @return {Promise<NextResponse<any>>} - レスポンスオブジェクト
 **/
export async function getDbUserIdFromToken(
  reqest: NextRequest | { headers: Headers }
): Promise<number | null> {
  const authHeader = reqest.headers.get('Authorization');
  let token = '';

  // tokenを取り出す
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = authHeader || '';
  }

  if (!token) return null;

  // SupabaseAuthに登録されたユーザー情報を返す
  const {
    data: { user },
  } = await supabase.auth.getUser(token);

  if (!user) return null;
  //
  const supabaseUserId = user.id;

  // supabaseUserIdをキーにuserIdを検索
  const dbUser = await prisma.user.findUnique({
    where: { supabaseUserId },
    select: { id: true },
  });

  return dbUser?.id ?? null;
}
