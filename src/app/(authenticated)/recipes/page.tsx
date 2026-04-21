'use client';

import { numberSchema } from '@/lib/validators/numberSchema';
import { recipeSummaryListSchema } from '@/lib/validators/recipeSchema';
import { Loading } from '@authenticated/components/Loading';
import { useRecipes } from '@authenticated/hooks/useRecipes';
import { useTalks } from '@authenticated/hooks/useTalks';
import { RecipeList } from '@authenticated/recipes/components/RecipeList';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function RecipeListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const result = numberSchema.safeParse(from);

  const url = result.success ? `/api/talks?talkRoomId=${result.data}` : null;

  const {
    data: talks,
    errorMsg: roomErrorMsg,
    isLoading: isRoomLoading,
  } = useTalks(url);
  // TODO: /api/talksを流用してtalkRoomの認可チェック →
  // /api/talkRoom/[id] を作成し分離（無駄なtalksデータ取得を防ぐため）

  const {
    data: recipeList,
    errorMsg: recipeListErrorMsg,
    isLoading: isRecipeListLoading,
  } = useRecipes(`/api/recipes`, recipeSummaryListSchema);

  const isInvalid = !result.success || roomErrorMsg;

  useEffect(() => {
    if (isInvalid) {
      router.replace('/talkRoom');
    }
  }, [isInvalid, router]);

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

    return <RecipeList recipeList={recipeList} from={from} />;
  };

  if (!result.success) return null;
  if (isRoomLoading) return <p>読み込み中</p>;
  if (roomErrorMsg) return null;

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
