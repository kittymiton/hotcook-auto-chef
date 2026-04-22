'use client';

import { recipeSummaryListSchema } from '@/lib/validators/recipeSchema';
import { userRoomSchema } from '@auth/lib/validation/userRoomSchema';
import { Loading } from '@authenticated/components/Loading';
import { useAuthedSWR } from '@authenticated/hooks/useAuthedSWR';
import { useRecipes } from '@authenticated/hooks/useRecipes';
import { RecipeList } from '@authenticated/recipes/components/RecipeList';
import Link from 'next/link';

export default function RecipeListPage() {
  const { data: userRoom } = useAuthedSWR('/api/userRoom', userRoomSchema);

  const {
    data: recipeList,
    errorMsg: recipeListErrorMsg,
    isLoading: isRecipeListLoading,
  } = useRecipes(`/api/recipes`, recipeSummaryListSchema);

  if (!userRoom) return <Loading />;

  const safeRoomId = userRoom.talkRoom.id;
  // TODO: 複数room/共有機能/URL直アクセスに対応する場合、roomIdをURLから取得、API側で認可チェック（/api/talkRoom/[id]）を作成する

  const renderRecipeList = () => {
    if (recipeListErrorMsg) {
      return <p>{recipeListErrorMsg}</p>;
    }
    if (!recipeList) {
      return <Loading />;
    }
    if (recipeList.length === 0) {
      return <p>レシピがまだありません</p>;
    }

    return (
      <RecipeList recipeList={recipeList} safeRoomId={safeRoomId.toString()} />
    );
  };

  return (
    <>
      <main className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">あなたのレシピ一覧</h1>
        {renderRecipeList()}
        <Link href={`/talkRoom/${safeRoomId}`} className="text-sm underline">
          会話に戻る
        </Link>
      </main>
    </>
  );
}
