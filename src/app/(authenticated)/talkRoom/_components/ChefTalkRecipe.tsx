import type { RecipeObj } from '@/lib/schema/recipeBlockSchema';

type RecipeCardProps = {
  recipe: RecipeObj;
};

export const ChefTalkRecipe = ({ recipe }: RecipeCardProps) => {
  return (
    <div className="bg-orange-50 p-2 rounded shadow mb-4">
      <h2 className="font-bold text-orange-700 mb-1">
        {recipe['レシピタイトル']}
      </h2>

      {recipe['ポイント'] && (
        <p className="text-sm mb-2 text-gray-700">
          <strong>ポイント:</strong> {recipe['ポイント']}
        </p>
      )}

      {recipe['調理時間'] && (
        <p className="text-sm mb-2 text-gray-700">
          <strong>調理時間:</strong> {recipe['調理時間']}
        </p>
      )}

      <div className="mb-2 text-gray-700">
        <strong>材料（2人分）:</strong>
        <ul className="list-disc list-inside text-sm">
          {recipe['材料（2人分）'].map((item, index) => (
            <li key={index}>{item}</li>
            // TODO:JSON構造を見直し：英語keyに変更 / keyにidを持たせley.idの形にする
          ))}
        </ul>
      </div>

      <div>
        <strong>作り方:</strong>
        <ol className="list-decimal list-inside text-sm text-gray-700">
          {recipe['作り方'].map((step, index) => (
            <li key={index}>{step.replace(/^\d+[:：]\s*/, '').trim()}</li>
            // TODO:JSON構造を見直し：配列のIndexを信頼し番号を振らずに返却するプロンプトへ変更する
          ))}
        </ol>
      </div>
    </div>
  );
};
