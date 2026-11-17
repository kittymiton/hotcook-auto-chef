import { type RecipeSummaryList } from '@/lib/schema/recipeSchema';

// レシピからタグを抽出
export const getRecentRecipeTags = (recipes: RecipeSummaryList) => {
  const tagArray = recipes.flatMap((recipe) => recipe.tags);
  const uniqueTags = [...new Set(tagArray)];
  return uniqueTags.slice(0, 8);
};
