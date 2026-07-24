import type { RecipeObj } from '@/lib/schema/recipeBlockSchema';
import { RecipeCookingTime } from '@authenticated/components/recipe/RecipeCookingTime';
import { RecipeIngredients } from '@authenticated/components/recipe/RecipeIngredients';
import { RecipeInstructions } from '@authenticated/components/recipe/RecipeInstructions';
import { RecipePoint } from '@authenticated/components/recipe/RecipePoint';
import { Surface } from '../../../../../components/ui/Surface';

type Props = {
  recipe: RecipeObj;
};
// NOTE: トーク内の読み取り専用
// TODO: RecipeDetail実装時に、材料・作り方などの内部表示を共通パーツとして抽出する。
export const TalkRecipe = ({ recipe }: Props) => {
  return (
    <Surface variant="recipe">
      <h2 className="mb-1 text-[18px] font-[600]">
        {recipe['レシピタイトル']}
      </h2>

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
