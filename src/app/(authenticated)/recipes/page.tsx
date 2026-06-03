'use client';

import { recipeSummaryListSchema } from '@/lib/schema/recipeSchema';
import { Loading } from '@authenticated/components/Loading';

import { useRecipes } from '@authenticated/hooks/useRecipes';
import { RecipeList } from '@authenticated/recipes/components/RecipeList';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RecipesPage() {
  const router = useRouter();

  const {
    data: recipes,
    error: recipesError,
    isLoading: isRecipsLoading,
  } = useRecipes(`/api/recipes`, recipeSummaryListSchema);

  if (recipesError) {
    return (
      <>
        <p>{recipesError}</p>
        <button onClick={() => router.back()}>戻る</button>
        <Link href="/">TOPに戻る</Link>
      </>
    );
  }

  const renderRecipeList = () => {
    if (isRecipsLoading || !recipes) {
      return <Loading />;
    }

    if (recipes.length === 0) {
      return <p>レシピがまだありません</p>;
    }

    return <RecipeList recipes={recipes} cookingTime={true} />;
  };

  // renderRecipeList内ガードの外なので、recipesが未取得でも落ちないようにする
  const talkRoomId = recipes?.[0]?.talkRoomId;
  // TODO: 複数room/共有機能/URL直アクセスに対応する場合、roomIdをURLparamsから取得、API側（/api/talkRoom/[id]）で認可チェックを行う

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">あなたのレシピ一覧</h1>

      {/* 側は出つつ、中身だけ出し分け */}
      {renderRecipeList()}

      {/* ちらつき防止 */}
      {talkRoomId && (
        <div className="mt-6">
          <Link href={`/talkRoom/${talkRoomId}`} className="text-sm underline">
            会話に戻る
          </Link>
        </div>
      )}
    </main>
  );
}
