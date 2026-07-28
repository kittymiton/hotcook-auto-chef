import z from 'zod';

export const recipeBaseSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
});
export const recipeSchema = z.array(recipeBaseSchema);
export type RecipeBaseList = z.infer<typeof recipeSchema>;

// レシピ一覧表示用 APIからフロント
export const recipeSummarySchema = recipeBaseSchema.extend({
  point: z.string().optional(),
  talkRoomId: z.number(),
  tags: z.array(z.string().min(1)),
});
export const recipeSummaryListSchema = z.array(recipeSummarySchema);
export type RecipeSummaryList = z.infer<typeof recipeSummaryListSchema>;

// レシピ詳細表示用 APIからフロント
export const recipeDetailSchema = recipeBaseSchema.extend({
  point: z.string().optional(),
  cookingTime: z.string().optional(),
  // TODO: cookingTimeは後で必須化し、空文字も弾く
  ingredients: z.string(),
  instructions: z.string(),
  imageKey: z.string().nullable().optional(),
  talkRoomId: z.number(),
  tags: z.array(z.string().min(1)),
});
export type RecipeDetail = z.infer<typeof recipeDetailSchema>;

export const stepsItemSchema = z.object({
  ingredients: z.array(z.string().trim().min(1)),
  instructions: z.array(z.string().trim().min(1)),
});
export type StepsItemList = z.infer<typeof stepsItemSchema>;
