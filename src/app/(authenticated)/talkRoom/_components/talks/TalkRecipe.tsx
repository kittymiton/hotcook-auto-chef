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
      <RecipeTitle title={recipe['レシピタイトル']} variant="compact" />
      <RecipePoint point={recipe['ポイント']} variant="compact" />
      <RecipeCookingTime cookingTime={recipe['調理時間']} variant="compact" />
      <RecipeIngredients
        ingredients={recipe['材料（2人分）']}
        variant="compact"
      />
      <RecipeInstructions instructions={recipe['作り方']} variant="compact" />
    </Surface>
  );
};
