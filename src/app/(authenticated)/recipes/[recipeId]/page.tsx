'use client';

import { errorCodeMap } from '@/lib/constants/errorCodeMap';
import { idParamSchema } from '@/lib/schema/paramSchema';
import { recipeDetailSchema, recipeSchema } from '@/lib/schema/recipeSchema';
import { Loading } from '@authenticated/components/Loading';
import { SideArea } from '@authenticated/components/side/SideArea';
import { SideNav } from '@authenticated/components/side/SideNav';
import { useRecipes } from '@authenticated/hooks/useRecipes';
import { RecipeItem } from '@authenticated/recipes/components/RecipeItem';
import { SideRecipeList } from '@authenticated/talkRoom/components/side/SideRecipeList';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Surface } from '../../../../components/ui/Surface';

export default function RecipeDetailPage() {
  const router = useRouter();
  const params = useParams();

  const parsedParams = idParamSchema.safeParse(params.recipeId);

  if (!parsedParams.success) {
    return (
      <main className="px-4">
        <p>{errorCodeMap.INVALID_ID}</p>
      </main>
    );
  }

  const recipeId = parsedParams.data;

  const recipeListUrl = `/api/recipes?take=5`;
  const recipeDetailUrl = `/api/recipes/${recipeId}`;

  // サイドナビ用の最新レシピ一覧
  const {
    data: recipes,
    error: recipesError,
    isLoading: isRecipesLoading,
  } = useRecipes(recipeListUrl, recipeSchema);

  // レシピ詳細
  const {
    data: recipe,
    error: recipeError,
    isLoading: isRecipeLoading,
  } = useRecipes(recipeDetailUrl, recipeDetailSchema);

  const renderRecipeList = () => {
    // NOTE: SideRecipeListは補助導線のため、取得失敗・未取得時は共通ナビのみ表示する
    if (recipesError || !recipes || recipes.length === 0) {
      return <SideNav />;
    }

    return (
      <SideNav>
        <SideRecipeList recipes={recipes} />
      </SideNav>
    );
  };

  const renderRecipeDetail = () => {
    if (recipeError) {
      return (
        <>
          <p>{recipeError}</p>
          <button onClick={() => router.back()}>戻る</button>
        </>
      );
    }

    if (isRecipeLoading) {
      return <Loading />;
    }

    if (!recipe) {
      // NOTE: 通常はAPI側でエラーになる想定だが、data未取得の保険として表示
      return (
        <>
          <p>レシピを表示できませんでした</p>
          <button onClick={() => router.back()}>戻る</button>
        </>
      );
    }

    const talkRoomId = recipe.talkRoomId;

    return (
      <>
        <Surface type="recipe-detail">
          <RecipeItem recipe={recipe} />
        </Surface>

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
      </>
    );
  };

  return (
    <div className="flex h-[calc(100vh-55px)] gap-8">
      <SideArea>{renderRecipeList()}</SideArea>

      {/* 全画面Loadingにせず、詳細エリアだけ状態を出し分ける */}
      <main className="min-h-0 flex-1 overflow-y-auto px-8 lg:pl-0 lg:pr-8">
        {renderRecipeDetail()}
      </main>
    </div>
  );
}
