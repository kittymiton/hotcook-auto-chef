'use client';

import { numberSchema } from '@/lib/schema/numberSchema';
import { recipeDetailSchema } from '@/lib/schema/recipeSchema';
import { Loading } from '@authenticated/components/Loading';
import { useRecipes } from '@authenticated/hooks/useRecipes';
import { RecipeItem } from '@authenticated/recipes/components/RecipeItem';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function RecipeDetailPage() {
  const router = useRouter();

  const params = useParams();
  const parsedParams = numberSchema.safeParse(params.recipeId);
  if (!parsedParams.success) return <p>不正なURLです</p>;

  const recipeId = parsedParams.data;

  const {
    data: recipe,
    error: recipeError,
    isLoading: isRecipeLoading,
  } = useRecipes(`/api/recipes/${recipeId}`, recipeDetailSchema);

  if (recipeError) {
    return (
      <>
        <p>{recipeError}</p>
        <button onClick={() => router.back()}>戻る</button>
        <Link href="/recipes">レシピ一覧に戻る</Link>
      </>
    );
  }

  if (isRecipeLoading || !recipe) {
    return <Loading />;
  }

  const talkRoomId = recipe.talkRoomId;

  return (
    <main className="p-6">
      <h1 className="mb-2 text-2xl font-bold">{recipe.title}</h1>

      <RecipeItem recipe={recipe} />

      <Link href={`/recipes`} className="text-sm underline">
        すべてのレシピを見る
      </Link>

      {talkRoomId && (
        <div className="mt-6">
          <Link href={`/talkRoom/${talkRoomId}`} className="text-sm underline">
            会話に戻る
          </Link>
        </div>
      )}
    </main>
  );
}
