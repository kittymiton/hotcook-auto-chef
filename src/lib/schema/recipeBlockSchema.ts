import z from 'zod';

// レシピ保存、Talk表示でレシピの形を保証するSchema
export const recipeBlockSchema = z.object({
  title: z.string().trim().min(1),
  ingredients: z.array(z.string().trim().min(1)),
  instructions: z.array(z.string().trim().min(1)),
  cookingTime: z.string().trim().min(1).optional(),
  point: z.string().trim().min(1).optional(),
  keywords: z
    .array(
      z.object({
        keyword: z.string().trim().min(1).max(20),
        normalizedKeyword: z.string().trim().min(1).max(40),
      })
    )
    .catch([]),
});

export type RecipeObj = z.infer<typeof recipeBlockSchema>;

export type AiKeywords = RecipeObj['keywords'];
