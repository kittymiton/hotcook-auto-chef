'use client';

import { useAuthedSWR } from '@/lib/apiClient/useAuthedSWR';
import type { RecipeDetail } from '@/types/recipe';
import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';

/**
 * 指定されたレシピIDの詳細情報を表示
 *
 * - /api/recipes/[recipeId]からレシピ詳細（RecipeDetail）を取得
 * - ingredientsとinstructionsはDBではJSON文字列のため、UIではJSON.parseして配列として扱う
 * - useSWRを使用して/api/recipes/${recipeId}をフェッチ
 * - DB/API層では文字列だが、UI層では配列として扱う型変換が発生
 * @param params.recipeId - DBレシピIDそのもの（URLから文字列として渡される）
 */
export default function RecipeDetailPage() {
  const { token } = useSupabaseSession();
  const params = useParams();
  const recipeId = Number(params.recipeId);
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const url = token ? `/api/recipes/${recipeId}` : null;
  const shouldFetch = !!token; // データ取得を行ってよい条件（token有無）

  const {
    data: recipe,
    error,
    isLoading,
  } = useAuthedSWR<RecipeDetail>(shouldFetch ? url : null, token);

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
