import type { RecipeObj } from '@/lib/schema/recipeBlockSchema';
import { RecipeCookingTime } from '@authenticated/components/recipe/RecipeCookingTime';
import { RecipeIngredients } from '@authenticated/components/recipe/RecipeIngredients';
import { RecipeInstructions } from '@authenticated/components/recipe/RecipeInstructions';
import { RecipePoint } from '@authenticated/components/recipe/RecipePoint';
import { RecipeTitle } from '@authenticated/components/recipe/RecipeTitle';
import { Surface } from '../../../../../components/ui/Surface';

type Props = {
  recipe: RecipeObj;
};
// トーク内の読み取り専用
export const TalkRecipe = ({ recipe }: Props) => {
  return (
    <Surface variant="recipe">
      <RecipeTitle title={recipe.title} variant="compact" />
      <RecipePoint point={recipe.point} variant="compact" />
      <RecipeCookingTime cookingTime={recipe.cookingTime} variant="compact" />
      <RecipeIngredients ingredients={recipe.ingredients} variant="compact" />
      <RecipeInstructions
        instructions={recipe.instructions}
        variant="compact"
      />
    </Surface>
  );
};
