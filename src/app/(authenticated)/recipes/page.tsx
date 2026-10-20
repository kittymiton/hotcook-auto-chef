'use client';

import { recipeSummaryListSchema } from '@/lib/schema/recipeSchema';
import { getErrorCode } from '@/lib/utils/getErrorCode';
import { userRoomSchema } from '@auth/lib/validation/userRoomSchema';
import { UnauthorizedError } from '@authenticated/components/error/UnauthorizedError';
import { Loading } from '@authenticated/components/Loading';
import { SideArea } from '@authenticated/components/side/SideArea';
import { SideNav } from '@authenticated/components/side/SideNav';
import { SideRecipeList } from '@authenticated/components/side/SideRecipeList';
import { useAuthedSWR } from '@authenticated/hooks/useAuthedSWR';
import { useRecipes } from '@authenticated/hooks/useRecipes';
import { RecipeList } from '@authenticated/recipes/components/RecipeList';
import { RecipeListDataState } from '@authenticated/recipes/components/RecipeListDataState';
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
    error: userRoomError,
    isLoading: isUserRoomLoading, // 取得中でも本線UIは止めない
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
  // TODO: UNAUTHORIZED判定関数化

  // エラーメッセージの重複判定用
  const userRoomErrorCode = userRoomError ? getErrorCode(userRoomError) : null;

  const talkRoomId = userRoom?.talkRoom.id;
  // TODO: 複数room/共有機能/URL直アクセス対応時、roomIdをURLparamsから取得、API（/api/talkRoom/[id]）で認可チェック

  const renderSideNav = () => {
    if (isRecipesLoading && !recipes) {
      return <Loading />;
    }

    if (!recipes || recipes.length === 0) {
      return <SideNav />;
    }

    return (
      <SideNav>
        <SideRecipeList recipes={recipes} showAllRecipesButton={false} />
      </SideNav>
    );
  };
  // TODO: SideNav共通化

  return (
    <div className="flex h-[calc(100vh-55px)] gap-8">
      <SideArea>{renderSideNav()}</SideArea>

      <main className="min-h-0 flex-1 overflow-y-auto px-8 lg:pl-0 lg:pr-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-2xl font-bold">あなたのレシピ一覧</h1>
          <RecipeListDataState
            recipes={recipes}
            recipesError={recipesError}
            userRoomErrorCode={userRoomErrorCode}
            isRecipesLoading={isRecipesLoading}
          />
          {recipes && <RecipeList recipes={recipes} />}
          {talkRoomId && (
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
            // TODO: 常時表示するチャットルームへの導線を共通コンポーネント化
          )}
        </div>
      </main>
      {/* TODO: Main領域のスクロール構造を整理、共通化範囲を検討・TalkAreaを汎用名にリネーム検討 */}
    </div>
  );
}
