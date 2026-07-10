import { stepsItemForParse } from '@/lib/parser/stepsItemForParse';
import type { RecipeDetail } from '@/lib/schema/recipeSchema';
import { RecipePoint } from '@authenticated/components/recipe/RecipePoint';
import { RecipeTag } from '@authenticated/components/recipe/RecipeTag';
import Image from 'next/image';

type Props = {
  recipe: RecipeDetail;
};

// 保存済みレシピの詳細・編集画面
export const RecipeItem = ({ recipe }: Props) => {
  const itemsBlock = stepsItemForParse(recipe.ingredients, recipe.instructions);

  return (
    <>
      <h1 className="mt-2 pt-2 text-2xl font-bold">{recipe.title}</h1>
      <p className="mb-2 text-gray-600">
        ⏱ 調理時間: {recipe.cookingTime || '不明'}
      </p>

      <RecipePoint point={recipe.point} />

      <section>
        <h2 className="mb-1 text-lg font-semibold">材料（2人分）</h2>
        <ul className="mb-4 list-inside list-disc">
          {itemsBlock.ingredients.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h2 className="mb-1 text-lg font-semibold">作り方</h2>
        <ol className="mb-4 list-inside list-decimal">
          {itemsBlock.instructions.map((step: string, i: number) => (
            <li key={i} className="mb-1">
              {step.replace(/^\d+[:：]\s*/, '').trim()}
            </li>
          ))}
        </ol>

        <h3 className="mb-2 text-sm font-semibold">キーワード</h3>
        <ul className="mb-4 flex flex-wrap gap-2">
          {recipe.tags.map((tag: string) => (
            <li key={tag}>
              <RecipeTag keyword={tag} />
            </li>
          ))}
        </ul>
      </section>

      {recipe.imageKey && (
        <Image
          src={`/images/${recipe.imageKey}`}
          alt={recipe.title}
          width={240}
          height={260}
          className="mb-4 rounded-lg shadow"
        />
      )}
    </>
  );
};
