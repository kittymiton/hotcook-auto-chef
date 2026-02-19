import z from 'zod';

const recipeBaseSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
});
export const recipeSchema = z.array(recipeBaseSchema);
export type RecipeBaseList = z.infer<typeof recipeSchema>;

export const recipeSummarySchema = recipeBaseSchema.extend({
  cookingTime: z.string().optional(),
});
export const recipeSummaryListSchema = z.array(recipeSummarySchema);
export type RecipeSummaryList = z.infer<typeof recipeSummaryListSchema>;

export const recipeDetailSchema = recipeBaseSchema.extend({
  point: z.string().optional(),
  cookingTime: z.string().optional(),
  ingredients: z.string(),
  instructions: z.string(),
  imageKey: z.string().nullable().optional(),
});
export type RecipeDetail = z.infer<typeof recipeDetailSchema>;

export const stepsItemSchema = z.object({
  ingredients: z.array(z.string().trim().min(1)),
  instructions: z.array(z.string().trim().min(1)),
});
export type StepsItemList = z.infer<typeof stepsItemSchema>;
