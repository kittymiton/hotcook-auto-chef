'use client';

import { recipeSummaryListSchema } from '@/lib/validators/recipeSchema';
import { Loading } from '@authenticated/components/Loading';
import { useRecipes } from '@authenticated/hooks/useRecipes';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function RecipeListPage() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const {
    data: recipeList,
    errorMsg,
    isLoading,
  } = useRecipes(`/api/recipes`, recipeSummaryListSchema);

  const renderRecipeList = () => {
    if (errorMsg) {
      return <p>取得に失敗しました: {errorMsg}</p>;
    }
    if (!recipeList) {
      return <Loading />;
    }
    if (recipeList.length === 0) {
      return <p>レシピがまだありません</p>;
    }

    return (
      <ul className="space-y-4">
        {recipeList.map((recipe) => (
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
    );
  };

  return (
    <>
      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">あなたのレシピ一覧</h1>
        {renderRecipeList()}
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
