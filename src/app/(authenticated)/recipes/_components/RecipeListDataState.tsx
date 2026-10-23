import type { ErrorCode } from '@/lib/schema/errorSchema';
import { RecipeSummaryList } from '@/lib/schema/recipeSchema';
import { filterErrorCodes } from '@/lib/utils/filterErrorCodes';
import { DisplayErrorMessage } from '@authenticated/components/error/DisplayErrorMessage';
import { Loading } from '@authenticated/components/Loading';

type Props = {
  recipes: RecipeSummaryList | undefined;
  recipesError: ErrorCode | null;
  userRoomErrorCode: ErrorCode | null;
  isRecipesLoading: boolean;
};

// データ取得後の状態に応じた表示制御
export const RecipeListDataState = ({
  recipes,
  recipesError,
  userRoomErrorCode,
  isRecipesLoading,
}: Props) => {
  // TODO: DataStateで共通している判定処理関数化検討
  if (isRecipesLoading && !recipes) {
    return <Loading />;
  }

  if (!recipesError && !recipes) {
    // 例外系（通信未開始など）によるdata未取得の表示
    return <p>レシピを表示できません</p>;
  }

  const emptyRecipesMessage = !recipesError &&
    recipes &&
    recipes.length === 0 && (
      <div className="pb-4 pt-4">
        <p>
          レシピがまだありません。
          <br />
          会話してオリジナルのレシピを作ってみましょう！
        </p>
      </div>
    );

  const filteredErrorCodeArray = filterErrorCodes(
    recipesError,
    userRoomErrorCode
  );

  return (
    <>
      {emptyRecipesMessage}
      {filteredErrorCodeArray.length > 0 && (
        <DisplayErrorMessage errorCodes={filteredErrorCodeArray} />
      )}
    </>
  );
};
