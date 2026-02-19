import z from 'zod';

const chatItemSchema = z.object({
  id: z.number(),
  content: z.string().min(1),
  sender: z.enum(['USER', 'CHEF']),
});
export const chatSchema = z.array(chatItemSchema);

export type ChatMessageList = z.infer<typeof chatSchema>;
