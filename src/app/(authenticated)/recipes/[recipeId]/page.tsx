'use client';

import { stepsItemForParse } from '@/lib/parser/stepsItemForParse';
import { numberSchema } from '@/lib/validators/numberSchema';
import { recipeDetailSchema } from '@/lib/validators/recipeSchema';
import { useAuthedSWR } from '@authenticated/hooks/useAuthedSWR';
import Link from 'next/link';
import { notFound, useParams, useSearchParams } from 'next/navigation';

export default function RecipeDetailPage() {
  const params = useParams();
  const result = numberSchema.safeParse(params.recipeId);
  if (!result.success) notFound();
  const recipeId = result.data;

  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const {
    data: recipe,
    error,
    isLoading,
  } = useAuthedSWR(`/api/recipes/${recipeId}`, recipeDetailSchema);

  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {String(error)}</p>;
  if (!recipe) return <p>レシピがありません</p>;

  const itemsBlock = stepsItemForParse(recipe.ingredients, recipe.instructions);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-2">{recipe.title}</h1>
      {recipe.imageKey && (
        <img
          src={`/images/${recipe.imageKey}`}
          alt={recipe.title}
          className="mb-4 rounded-lg shadow"
        />
      )}
      <p className="mb-2 text-gray-600">
        ⏱ 調理時間: {recipe.cookingTime || '不明'}
      </p>
      <p className="mb-4">{recipe.point}</p>
      <section>
        <h2 className="text-lg font-semibold mb-1">材料（2人分）</h2>
        <ul className="list-disc list-inside mb-4">
          {itemsBlock.ingredients.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h2 className="text-lg font-semibold mb-1">作り方</h2>
        <ol className="list-decimal list-inside">
          {itemsBlock.instructions.map((step: string, i: number) => (
            <li key={i} className="mb-1">
              {step.replace(/^\d+[:：]\s*/, '').trim()}
            </li>
          ))}
        </ol>
      </section>
      {recipe && (
        <Link
          href={`/recipes?from=${from}`}
          prefetch={false}
          className="text-sm underline"
        >
          すべてのレシピを見る
        </Link>
      )}
      {from && (
        <Link
          href={`/talkRoom/${from}`}
          prefetch={false}
          className="text-sm underline"
        >
          会話に戻る
        </Link>
      )}
    </main>
  );
}
