'use client';

import { useAuthedSWR } from '@/lib/apiClient/useAuthedSWR';
import type { RecipeSummary } from '@/types/recipe';
import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

/**
 * レシピ一覧を表示
 *
 * - /api/recipesからレシピ情報（RecipeSummary[]）を取得
 * - useSWRを使用して/api/recipesをフェッチ
 * - UI用のデータはAPIが返す構造をそのまま利用
 */
export default function RecipeListPage() {
  const { token } = useSupabaseSession();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const url = token ? `/api/recipes` : null;
  const shouldFetch = !!token; // データ取得を行ってよい条件（token有無）

  const {
    data: recipes,
    error,
    isLoading,
  } = useAuthedSWR<RecipeSummary[]>(shouldFetch ? url : null, token);

  if (isLoading) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {String(error)}</p>;
  if (!recipes) return <p>レシピがありません</p>;

  return (
    <>
      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">あなたのレシピ一覧</h1>

        <ul className="space-y-4">
          {recipes.map((recipe) => (
            <li
              key={recipe.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {from && (
                <Link
                  href={`/recipes/${recipe.id}?from=${from}`}
                  prefetch={false}
                >
                  {recipe.imageKey && (
                    <img
                      src={`/images/${recipe.imageKey}`}
                      alt={recipe.title}
                      className="w-24 h-24 object-cover rounded mt-2 sm:mt-0"
                    />
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                        {recipe.title}
                      </h2>
                      <p className="text-sm">調理時間: {recipe.cookingTime}</p>
                    </div>
                  </div>
                </Link>
              )}
            </li>
          ))}
        </ul>
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
    </>
  );
}
