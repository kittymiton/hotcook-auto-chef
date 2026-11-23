import { type RecipeSummaryList } from '@/lib/schema/recipeSchema';

// URLタグと一致するレシピを絞り込む
export const filterRecipesByTag = (
  recipes: RecipeSummaryList,
  selectedTag: string | null
) => {
  return selectedTag
    ? recipes.filter((recipe) => recipe.tags.includes(selectedTag))
    : recipes;
};
