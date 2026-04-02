import { RecipeObj } from '@/lib/schema/recipeBlockSchema';

export type ParsedContent = {
  prefix: string;
  recipe: RecipeObj | null;
  suffix: string | null;
};
