import { API_USERROOM_PATH } from '@/constants/index';
import { fetcher } from '@/lib/apiClient/fetcher';
import type { InitUserContextRequest } from '@/types/auth';
import { Session } from '@supabase/supabase-js';
import { userRoomSchema } from './validation/userRoomSchema';

export const upsertUserRoom = async (
  session: Session
): Promise<{ id: number }> => {
  const { user, access_token } = session;

  if (!user.email) {
    throw new Error('emailがありません');
  }

  const body: InitUserContextRequest = {
    supabaseUserId: user.id,
    email: user.email,
  };

  const result = userRoomSchema.parse(
    await fetcher(API_USERROOM_PATH, {
      method: 'POST',
      token: access_token,
      body,
    })
  );
  const { talkRoom } = result;
  return talkRoom;
};
