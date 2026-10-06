'use client';

import { errorCodeMap } from '@/lib/constants/errorCodeMap';
import { idParamSchema } from '@/lib/schema/paramSchema';
import { recipeDetailSchema, recipeSchema } from '@/lib/schema/recipeSchema';
import { DisplayErrorMessage } from '@authenticated/components/error/DisplayErrorMessage';
import { UnauthorizedError } from '@authenticated/components/error/UnauthorizedError';
import { Loading } from '@authenticated/components/Loading';
import { SideArea } from '@authenticated/components/side/SideArea';
import { SideNav } from '@authenticated/components/side/SideNav';
import { useRecipes } from '@authenticated/hooks/useRecipes';
import { RecipeItem } from '@authenticated/recipes/components/RecipeItem';
import { SideRecipeList } from '@authenticated/talkRoom/components/side/SideRecipeList';
import { useParams } from 'next/navigation';
import { Button } from '../../../../components/ui/Button';
import { Icon } from '../../../../components/ui/Icon';
import { IconWrapper } from '../../../../components/ui/IconWrapper';

export default function RecipeDetailPage() {
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

  const recipeDetailUrl = `/api/recipes/${recipeId}`;
  const recipeListUrl = `/api/recipes?take=5`;

  // レシピ詳細
  const {
    data: recipe,
    error: recipeError,
    isLoading: isRecipeLoading,
  } = useRecipes(recipeDetailUrl, recipeDetailSchema);

  // SideNav用レシピ一覧
  const {
    data: recipes,
    error: recipesError,
    isLoading: isRecipesLoading,
  } = useRecipes(recipeListUrl, recipeSchema);

  if (recipeError) {
    const code = recipeError;

    if (code === 'UNAUTHORIZED') {
      return <UnauthorizedError />;
    }
  }

  if (recipesError) {
    const code = recipesError;

    if (code === 'UNAUTHORIZED') {
      return <UnauthorizedError />;
    }
  }

  const renderSideRecipeList = () => {
    if (isRecipesLoading || !recipes) {
      return <Loading />;
    }

    if (recipes.length === 0) {
      return <SideNav />;
    }

    return (
      <SideNav>
        <SideRecipeList recipes={recipes} />
      </SideNav>
    );
  };

  const renderRecipeDetail = () => {
    if (isRecipeLoading) {
      return <Loading />;
    }

    if (!recipe) {
      return <p>レシピ詳細を表示できません</p>;
    }

    const talkRoomId = recipe.talkRoomId;

    const errorCodeArray = [recipeError, recipesError];

    const filterdErrorCodeArray = errorCodeArray.filter(
      (code) => code !== null
    );

    return (
      <>
        {filterdErrorCodeArray.length > 0 && (
          <DisplayErrorMessage errorCodes={filterdErrorCodeArray} />
        )}

        <RecipeItem recipe={recipe} />

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
          // TODO: チャットルームへの導線を共通コンポーネント化
        )}
      </>
    );
  };

  return (
    <div className="flex h-[calc(100vh-55px)] gap-8">
      <SideArea>{renderSideRecipeList()}</SideArea>

      <main className="min-h-0 flex-1 overflow-y-auto px-8 lg:pl-0 lg:pr-8">
        {/* // TODO: MainArea共通化時にscroll/padding差分をどう持たせるか整理 */}
        {renderRecipeDetail()}
      </main>
    </div>
  );
}
