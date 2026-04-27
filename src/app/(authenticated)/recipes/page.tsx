'use client';

import { recipeSummaryListSchema } from '@/lib/schema/recipeSchema';
import { userRoomSchema } from '@auth/lib/validation/userRoomSchema';
import { Loading } from '@authenticated/components/Loading';

import { useAuthedSWR } from '@authenticated/hooks/useAuthedSWR';
import { useRecipes } from '@authenticated/hooks/useRecipes';
import { RecipeList } from '@authenticated/recipes/components/RecipeList';
import Link from 'next/link';

export default function RecipesPage() {
  const {
    data: recipes,
    error: recipeError,
    isLoading: isRecipsLoading,
  } = useRecipes(`/api/recipes`, recipeSummaryListSchema);

  const { data: userRoom } = useAuthedSWR('/api/userRoom', userRoomSchema);
  if (!userRoom) return <Loading />;

  const talkRoomId = userRoom.talkRoom.id;
  // TODO: 複数room/共有機能/URL直アクセスに対応する場合、roomIdをURLから取得、API側で認可チェック（/api/talkRoom/[id]）を作成する

  const renderRecipeList = () => {
    if (recipeError) {
      return <p>{recipeError}</p>;
    }
    if (!recipes) {
      return <Loading />;
    }
    if (recipes.length === 0) {
      return <p>レシピがまだありません</p>;
    }
    return <RecipeList recipes={recipes} cookingTime={true} />;
  };

  return (
    <>
      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">あなたのレシピ一覧</h1>
        {renderRecipeList()}
        <Link href={`/talkRoom/${talkRoomId}`} className="text-sm underline">
          会話に戻る
        </Link>
      </main>
    </>
  );
}
