import { extractedRecipeBlock } from '@/lib/parser/extractedRecipeBlock';
import { recipeBlockSchema } from '@/lib/validators/recipeBlockSchema';
import { type ParsedContent } from '@/types/talk';

export function splitChefContent(chefContent: string): ParsedContent {
  const extracted = extractedRecipeBlock(chefContent);
  if (!extracted) {
    return {
      prefix: chefContent,
      recipe: null,
      suffix: null,
    };
  }
  const { block, recipeJson, index } = extracted;
  const jsonBlockLength = block.length;
  const recipe = recipeBlockSchema.parse(JSON.parse(recipeJson));

  const prefix = chefContent.slice(0, index).trim();

  const suffix = chefContent.slice(index + jsonBlockLength).trim();
  return {
    prefix,
    recipe,
    suffix: suffix.length ? suffix : null,
  };
}
