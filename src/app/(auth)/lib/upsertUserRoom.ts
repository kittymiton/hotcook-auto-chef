import { API_USERROOM_PATH } from '@/constants/index';
import { fetcher } from '@/lib/apiClient/fetcher';
import type { InitUserContextRequest } from '@/types/auth';
import { Session } from '@supabase/supabase-js';

/**
 * ユーザーに紐づいたトークルームを作成/取得登録のリクエストをバックエンドに送る関数
 * @params session（認証済みセッション）
 * @returns talkRoom（idプロパティを持つオブジェクトのみ返す）
 **/
export const upsertUserRoom = async (
  session: Session
): Promise<{ id: string }> => {
  const { user, access_token } = session;

  if (!user.email) {
    throw new Error('emailがありません');
  }

  const body: InitUserContextRequest = {
    supabaseUserId: user.id,
    email: user.email,
  };

  const { talkRoom } = await fetcher(API_USERROOM_PATH, {
    method: 'POST',
    token: access_token,
    body,
  });
  return talkRoom;
};
