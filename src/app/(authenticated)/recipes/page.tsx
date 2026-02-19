'use client';

import { recipeSummaryListSchema } from '@/lib/validators/recipeSchema';
import { useAuthedSWR } from '@authenticated/hooks/useAuthedSWR';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function RecipeListPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const {
    data: recipes,
    error,
    isLoading,
  } = useAuthedSWR(`/api/recipes`, recipeSummaryListSchema);

  if (isLoading || !recipes) return <p>読み込み中...</p>;
  if (error) return <p>エラー: {String(error)}</p>;
  if (recipes.length === 0) return <p>レシピがありません</p>;

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
