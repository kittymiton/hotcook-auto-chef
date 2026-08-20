import { openAIRecipeResponseSchema } from '@/lib/schema/openAIRecipeResponseSchema';
import z from 'zod';

// トーク画面に表示する1件
export const chatItemSchema = z.object({
  id: z.number(),
  content: z.string().min(1),
  recipeSnapshot: openAIRecipeResponseSchema.nullable(),
  afterRecipeContent: z.string().nullable(),
  sender: z.enum(['USER', 'CHEF']),
});
export type ChatItem = z.infer<typeof chatItemSchema>;

// APIレスポンス全体スキーマ
export const chatSchema = z.array(chatItemSchema);
export type ChatItemList = z.infer<typeof chatSchema>;
