import type { RecipeObj } from '@/lib/schema/recipeBlockSchema';
import { RecipeCookingTime } from '@authenticated/components/recipe/RecipeCookingTime';
import { RecipeIngredients } from '@authenticated/components/recipe/RecipeIngredients';
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

      <div>
        <strong>作り方:</strong>
        <ol>
          {recipe['作り方'].map((step, index) => (
            <li key={index} className="flex gap-2">
              <span className="shrink-0 font-bold">{index + 1}.</span>
              <span>{step.replace(/^\d+[:：]\s*/, '').trim()}</span>
            </li>
            // TODO:JSON構造を見直し：配列のIndexを信頼し番号を振らずに返却するプロンプトへ変更する
          ))}
        </ol>
      </div>
    </Surface>
  );
};
