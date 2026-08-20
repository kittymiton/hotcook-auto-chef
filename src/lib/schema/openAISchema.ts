import z from 'zod';

// API→外部API
export const openAIChatRequestSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1),
});
export type OpenAIChatRequest = z.infer<typeof openAIChatRequestSchema>;

export const recentMessageSchema = z.array(openAIChatRequestSchema);
export type RecentMessage = z.infer<typeof recentMessageSchema>;

// フロント→API
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
