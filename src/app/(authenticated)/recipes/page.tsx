'use client';

import { errorCodeMap } from '@/lib/constants/errorCodeMap';
import { recipeSummaryListSchema } from '@/lib/schema/recipeSchema';
import { getErrorCode } from '@/lib/utils/getErrorCode';
import { userRoomSchema } from '@auth/lib/validation/userRoomSchema';
import { UnauthorizedError } from '@authenticated/components/error/UnauthorizedError';
import { Loading } from '@authenticated/components/Loading';
import { SideArea } from '@authenticated/components/side/SideArea';
import { SideNav } from '@authenticated/components/side/SideNav';
import { useAuthedSWR } from '@authenticated/hooks/useAuthedSWR';
import { useRecipes } from '@authenticated/hooks/useRecipes';
import { RecipeList } from '@authenticated/recipes/components/RecipeList';
import { SideRecipeList } from '@authenticated/talkRoom/components/side/SideRecipeList';
import { Button } from '../../../components/ui/Button';
import { Icon } from '../../../components/ui/Icon';
import { IconWrapper } from '../../../components/ui/IconWrapper';

export default function RecipesPage() {
  const {
    data: recipes,
    error: recipesError,
    isLoading: isRecipesLoading,
  } = useRecipes(`/api/recipes`, recipeSummaryListSchema);

  // レシピ0件時に会話へ戻る導線用補助データ
  const {
    data: userRoom,
    isLoading: isUserRoomLoading,
    error: userRoomError,
  } = useAuthedSWR('/api/userRoom', userRoomSchema);

  if (recipesError) {
    const code = recipesError;

    if (code === 'UNAUTHORIZED') {
      return <UnauthorizedError />;
    }
  }

  if (userRoomError) {
    // UI分岐用にerrorCodeへ変換
    const code = getErrorCode(userRoomError);

    if (code === 'UNAUTHORIZED') {
      return <UnauthorizedError />;
    }
  }

  // エラーメッセージの重複判定用
  const userRoomErrorCode = userRoomError ? getErrorCode(userRoomError) : null;

  if (isUserRoomLoading) {
    return <Loading />;
  }

  const talkRoomId = !userRoomError && userRoom?.talkRoom.id;
  // TODO: 複数room/共有機能/URL直アクセス対応時、roomIdをURLparamsから取得、API（/api/talkRoom/[id]）で認可チェック

  const renderSideRecipeList = () => {
    if (isRecipesLoading || !recipes) {
      return <Loading />;
    }

    if (recipes.length === 0) {
      return <SideNav />;
    }

    return (
      <SideNav>
        <SideRecipeList recipes={recipes} showAllRecipesButton={false} />
      </SideNav>
    );
  };

  const renderMainRecipeList = () => {
    // 初回取得時のみLoadingを表示、再取得中は既存のrecipesを表示
    if (isRecipesLoading && !recipes) {
      return <Loading />;
    }

    if (!recipes) {
      // NOTE: 通常はerrorかLoadingに入る想定だが、data未取得の保険として表示
      return <p>レシピを表示できません</p>;
    }

    const emptyRecipesMessage =
      !recipesError && talkRoomId && recipes && recipes.length === 0 ? (
        <>
          <div className="pb-4 pt-4">
            <p>
              レシピがまだありません。
              <br />
              会話してオリジナルのレシピを作ってみましょう！
            </p>
          </div>
          <div className="mt-6">
            <Button href={`/talkRoom/${talkRoomId}`} variant="action-primary">
              <IconWrapper>
                <Icon
                  src="/icons/system/chat.svg"
                  width={14}
                  height={14}
                  className="size-[14px]"
                />
              </IconWrapper>
              <span>Chat</span>
            </Button>
          </div>
        </>
      ) : null;

    return (
      <>
        {/* 正常系：データなし */}
        {emptyRecipesMessage}

        {/* 異常系：データ有無に関係なく取得エラーを表示。Side非表示時も見えるようmainに表示 */}
        {/* 同一errorCodeの場合はエラー表示を重複させない */}
        {recipesError && userRoomError && recipesError === userRoomErrorCode ? (
          // 両方に同じerrorCode
          <p className="mb-1 text-red-600">{errorCodeMap[recipesError]}</p>
        ) : // 両方に異なるerrorCode
        recipesError && userRoomErrorCode ? (
          <>
            <p className="mb-1 text-red-600">{errorCodeMap[recipesError]}</p>
            <p className="mb-1 text-red-600">
              {errorCodeMap[userRoomErrorCode]}
            </p>
          </>
        ) : (
          // 片方のみエラーあり
          <>
            {recipesError && (
              <p className="mb-1 text-red-600">{errorCodeMap[recipesError]}</p>
            )}
            {userRoomErrorCode && (
              <p className="mb-1 text-red-600">
                {errorCodeMap[userRoomErrorCode]}
              </p>
            )}
          </>
        )}
        {/* TODO: 現在はSWR keyがユーザー単位でないため、userRoomError時はキャッシュのroomIdを信用しない。key改修後に再検討 */}

        <RecipeList recipes={recipes} />
      </>
    );
  };

  return (
    <div className="flex h-[calc(100vh-55px)] gap-8">
      <SideArea>{renderSideRecipeList()}</SideArea>

      <main className="min-h-0 flex-1 overflow-y-auto px-8 lg:pl-0 lg:pr-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-2xl font-bold">あなたのレシピ一覧</h1>

          {/* 全画面Loadingにせず、一覧エリアだけ状態を出し分ける */}
          {renderMainRecipeList()}
        </div>
      </main>
      {/* TODO: Main領域のスクロール構造を整理、共通化範囲を検討・TalkAreaを汎用名にリネーム検討 */}
    </div>
  );
}
