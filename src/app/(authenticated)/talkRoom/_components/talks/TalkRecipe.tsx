import type { RecipeObj } from '@/lib/schema/recipeBlockSchema';
import { Surface } from '../../../../../components/ui/Surface';

type Props = {
  recipe: RecipeObj;
};
// NOTE: トーク内の読み取り専用
// TODO: RecipeDetail実装時に、材料・作り方などの内部表示を共通パーツとして抽出する。
export const TalkRecipe = ({ recipe }: Props) => {
  return (
    <Surface type="recipe">
      <h2 className="mb-1 text-[18px] font-[600]">
        {recipe['レシピタイトル']}
      </h2>

      {recipe['ポイント'] && (
        <p className="mb-1">
          <strong>ポイント:</strong> {recipe['ポイント']}
        </p>
      )}

      {recipe['調理時間'] && (
        <p className="mb-1">
          <strong>調理時間:</strong> {recipe['調理時間']}
        </p>
      )}

      <div className="mb-1">
        <strong>材料（2人分）:</strong>
        <ul>
          {recipe['材料（2人分）'].map((item, index) => (
            <li
              key={index}
              className="relative pl-6 before:absolute before:left-[0.2em] before:top-[0.6em] before:h-2 before:w-2 before:rounded-full before:bg-primary before:content-['']"
            >
              {item}
            </li>
            // TODO:JSON構造を見直し：英語keyに変更 / keyにidを持たせkey.idの形にする
          ))}
        </ul>
      </div>

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
