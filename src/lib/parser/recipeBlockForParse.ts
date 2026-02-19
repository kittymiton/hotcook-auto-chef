import { extractedRecipeBlock } from '@/lib/parser/extractedRecipeBlock';
import {
  recipeBlockSchema,
  type RecipeObj,
} from '@/lib/validators/recipeBlockSchema';

export function recipeBlockForParse(chefContent: string): RecipeObj | null {
  const extracted = extractedRecipeBlock(chefContent);
  if (!extracted) return null;
  try {
    const parsed = JSON.parse(extracted.recipeJson);
    const result = recipeBlockSchema.safeParse(parsed);
    if (!result.success) {
      return null;
    }
    return result.data;
  } catch {
    return null;
  }
}
