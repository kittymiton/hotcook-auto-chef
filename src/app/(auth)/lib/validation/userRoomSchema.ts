import z from 'zod';

// ログイン中ユーザーに紐づくtalkRoomIdを検証
export const userRoomSchema = z.object({
  talkRoom: z.object({ id: z.number() }),
});
