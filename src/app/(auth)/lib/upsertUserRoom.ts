import { API_USERROOM_PATH } from '@/constants/index';
import { fetcher } from '@/lib/apiClient/fetcher';
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
  const { talkRoom } = await fetcher(API_USERROOM_PATH, {
    method: 'POST',
    token: access_token,
    body: {
      supabaseUserId: user.id,
      email: user.email, // 初期name表示で使用;
    },
  });
  return talkRoom;
};
