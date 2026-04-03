import z from 'zod';

export const recipeBlockSchema = z.object({
  レシピタイトル: z.string().trim().min(1),
  '材料（2人分）': z.array(z.string().trim().min(1)),
  作り方: z.array(z.string().trim().min(1)),
  調理時間: z.string().trim().min(1).optional(),
  ポイント: z.string().trim().min(1).optional(),
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
