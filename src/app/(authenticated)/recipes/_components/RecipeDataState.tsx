import type { ErrorCode } from '@/lib/schema/errorSchema';
import { RecipeDetail } from '@/lib/schema/recipeSchema';
import { filterErrorCodes } from '@/lib/utils/filterErrorCodes';
import { DisplayErrorMessage } from '@authenticated/components/error/DisplayErrorMessage';
import { Loading } from '@authenticated/components/Loading';

type Props = {
  recipe: RecipeDetail | undefined;
  recipeError: ErrorCode | null;
  isRecipeLoading: boolean;
  recipesError: ErrorCode | null;
};

// データ取得後の状態に応じた表示制御
export const RecipeDataState = ({
  recipe,
  recipeError,
  isRecipeLoading,
  recipesError,
}: Props) => {
  if (isRecipeLoading && !recipe) {
    return <Loading />;
  }

  if (!recipe) {
    // 例外系
    return <p>レシピ詳細を表示できません</p>;
  }

  const filteredErrorCodeArray = filterErrorCodes(recipeError, recipesError);

  return (
    <>
      {filteredErrorCodeArray.length > 0 && (
        <DisplayErrorMessage errorCodes={filteredErrorCodeArray} />
      )}
    </>
  );
};
