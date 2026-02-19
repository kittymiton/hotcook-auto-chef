import { RecipeObj } from '@/lib/validators/recipeBlockSchema';

export type ParsedContent = {
  prefix: string;
  recipe: RecipeObj | null;
  suffix: string | null;
};
