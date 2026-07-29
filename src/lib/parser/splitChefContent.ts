import { extractedRecipeBlock } from '@/lib/parser/extractedRecipeBlock';
import { recipeBlockSchema, RecipeObj } from '@/lib/schema/recipeBlockSchema';

// AI返答を文章とレシピに分割した結果の型
type ParsedChefContent = {
  prefix: string;
  recipe: RecipeObj | null;
  suffix: string | null;
};

export function splitChefContent(chefContent: string): ParsedChefContent {
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
