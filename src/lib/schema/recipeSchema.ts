import z from 'zod';

export const recipeBaseSchema = z.object({
  id: z.number(),
  title: z.string().trim().min(1),
});
export const recipeSchema = z.array(recipeBaseSchema);
export type RecipeBaseList = z.infer<typeof recipeSchema>;

// レシピ一覧表示用 APIからフロント
export const recipeSummarySchema = recipeBaseSchema.extend({
  point: z.string().trim().min(1),
  talkRoomId: z.number(),
  tags: z.array(z.string().trim().min(1)),
});
export const recipeSummaryListSchema = z.array(recipeSummarySchema);
export type RecipeSummaryList = z.infer<typeof recipeSummaryListSchema>;

// レシピ詳細表示用 APIからフロント
export const recipeDetailSchema = recipeBaseSchema.extend({
  point: z.string().trim().min(1),
  cookingTime: z.string().trim().min(1),
  ingredients: z.string().trim().min(1),
  instructions: z.string().trim().min(1),
  imageKey: z.string().nullable().optional(),
  talkRoomId: z.number(),
  tags: z.array(z.string().trim().min(1)),
});
export type RecipeDetail = z.infer<typeof recipeDetailSchema>;

export const stepsItemSchema = z.object({
  ingredients: z.array(z.string().trim().min(1)).min(1),
  instructions: z.array(z.string().trim().min(1)).min(1),
});
export type StepsItemList = z.infer<typeof stepsItemSchema>;
