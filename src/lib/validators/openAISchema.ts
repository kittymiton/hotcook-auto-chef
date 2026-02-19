import z from 'zod';

export const openAIRequestSchema = z.object({
  content: z.string().min(1),
  talkRoomId: z.number(),
});

export const openAIChatResponseSchema = z.object({
  content: z.string().min(1),
});
