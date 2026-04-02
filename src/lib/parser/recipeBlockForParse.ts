import { extractedRecipeBlock } from '@/lib/parser/extractedRecipeBlock';
import {
  recipeBlockSchema,
  type RecipeObj,
} from '@/lib/schema/recipeBlockSchema';

export function recipeBlockForParse(chefContent: string): RecipeObj | null {
  const extracted = extractedRecipeBlock(chefContent);
  if (!extracted) return null;

  try {
    const parsed = JSON.parse(extracted.recipeJson);
    const result = recipeBlockSchema.safeParse(parsed);
    if (!result.success) {
      console.error('[Talk API] POST Validation failed', result.error);
      return null;
    }
    return result.data;
  } catch (e) {
    console.error('[Talk API] POST JSON parse failed', e);
    return null;
  }
}
