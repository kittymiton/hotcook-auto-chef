import z from 'zod';

export const userRoomSchema = z.object({
  talkRoom: z.object({ id: z.number() }),
});
