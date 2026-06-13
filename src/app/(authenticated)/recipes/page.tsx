'use client';

import { recipeSummaryListSchema } from '@/lib/schema/recipeSchema';
import { Loading } from '@authenticated/components/Loading';
import { SideArea } from '@authenticated/components/side/SideArea';
import { SideNav } from '@authenticated/components/side/SideNav';
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
    // 初回取得時のみLoadingを表示、再取得中は既存のrecipesを表示
    if (isRecipsLoading && !recipes) {
      return <Loading />;
    }

    if (!recipes) {
      // NOTE: 通常はerrorかLoadingに入る想定だが、data未取得の保険として表示
      return (
        <>
          <p>レシピを表示できませんでした</p>
          <button onClick={() => router.back()}>戻る</button>
        </>
      );
    }

    if (recipes.length === 0) {
      return (
        <p>
          レシピがありません。
          <br />
          レシピを作ってみましょう！
        </p>
      );
    }

    return <RecipeList recipes={recipes} cookingTime={true} />;
  };

  // renderRecipeList内ガードの外なので、recipesが未取得でも落ちないようにする
  const talkRoomId = recipes?.[0]?.talkRoomId;
  // TODO: 複数room/共有機能/URL直アクセスに対応する場合、roomIdをURLparamsから取得、API側（/api/talkRoom/[id]）で認可チェックを行う

  return (
    <div className="flex h-[calc(100vh-55px)] gap-8">
      <SideArea>
        <SideNav />
      </SideArea>

      <main className="min-h-0 flex-1 overflow-y-auto px-8 lg:pl-0 lg:pr-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-2xl font-bold">あなたのレシピ一覧</h1>

          {/* 全画面Loadingにせず、一覧エリアだけ状態を出し分ける */}
          {renderRecipeList()}

          {/* ちらつき防止 */}
          {talkRoomId && (
            <div className="mt-6">
              <Link
                href={`/talkRoom/${talkRoomId}`}
                className="text-sm underline"
              >
                会話に戻る
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
