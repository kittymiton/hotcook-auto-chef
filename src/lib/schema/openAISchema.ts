import z from 'zod';

export const openAIRequestSchema = z.object({
  content: z
    .string()
    .min(1, 'メッセージを入力してください')
    .max(1000, '1000文字以内で入力してください'),
  talkRoomId: z.number(),
});

export const openAIChatResponseSchema = z.object({
  content: z.string().min(1),
});
