import { findRecipeBlock } from '@/lib/parser/findRecipeBlock';
import {
  recipeBlockSchema,
  type RecipeObj,
} from '@/lib/validators/recipeBlockSchema';

export function findRecipeBlockForParse(chefContent: string): RecipeObj | null {
  const recipeBlock = findRecipeBlock(chefContent);
  if (!recipeBlock) return null;
  try {
    const parsed = JSON.parse(recipeBlock);
    const result = recipeBlockSchema.safeParse(parsed);
    if (!result.success) {
      return null;
    }
    return result.data;
  } catch {
    return null;
  }
}
