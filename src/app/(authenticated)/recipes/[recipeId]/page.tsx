'use client';

import type { RecipeDetail } from '@/types/recipe';
import { useAuthedSWR } from '@authenticated/hooks/useAuthedSWR';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';

/**
 * レシピ詳細ページ
 * - ingredientsとinstructionsはDBではJSON文字列のため、UIではJSON.parseして配列として扱う
 * - useSWRを使用して/api/recipes/${recipeId}をフェッチ
 * - DB/API層では文字列だが、UI層では配列として扱う型変換が発生
 * - recipeId: DBのレシピID（URLパス）
 * - useParams()でパス取得、useSearchParams()でクエリ取得
 */
export default function RecipeDetailPage() {
  const params = useParams();
  const recipeId = Number(params.recipeId);
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const {
    data: recipe,
    error,
    isLoading,
  } = useAuthedSWR<RecipeDetail>(`/api/recipes/${recipeId}`);

  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {String(error)}</p>;
  if (!recipe) return <p>レシピがありません</p>;

  const ingredientsArray = JSON.parse(recipe.ingredients);
  const instructionsArray = JSON.parse(recipe.instructions);

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
          {Array.isArray(ingredientsArray) &&
            ingredientsArray.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
        </ul>

        <h2 className="text-lg font-semibold mb-1">作り方</h2>
        <ol className="list-decimal list-inside">
          {Array.isArray(instructionsArray) &&
            instructionsArray.map((step: string, i: number) => (
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
