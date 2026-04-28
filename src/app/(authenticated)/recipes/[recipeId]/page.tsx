'use client';

import { numberSchema } from '@/lib/schema/numberSchema';
import { recipeDetailSchema } from '@/lib/schema/recipeSchema';
import { userRoomSchema } from '@auth/lib/validation/userRoomSchema';
import { Loading } from '@authenticated/components/Loading';
import { useAuthedSWR } from '@authenticated/hooks/useAuthedSWR';
import { useRecipes } from '@authenticated/hooks/useRecipes';
import { RecipeItem } from '@authenticated/recipes/components/RecipeItem';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function RecipeDetailPage() {
  const params = useParams();
  const parsedParams = numberSchema.safeParse(params.recipeId);
  if (!parsedParams.success) return <p>不正なURLです</p>;

  const recipeId = parsedParams.data;

  const {
    data: recipe,
    error: recipeError,
    isLoading: isRecipsLoading,
  } = useRecipes(`/api/recipes/${recipeId}`, recipeDetailSchema);

  const { data: userRoom } = useAuthedSWR('/api/userRoom', userRoomSchema);
  if (!userRoom) return <Loading />;

  const talkRoomId = userRoom.talkRoom.id;

  if (recipeError) {
    return (
      <div>
        <p>{recipeError}</p>
        <Link href="/recipes" className="text-sm underline">
          レシピ一覧に戻る
        </Link>
        <Link href={`/talkRoom/${talkRoomId}`} className="text-sm underline">
          会話に戻る
        </Link>
      </div>
    );
  }

  if (!recipe) {
    return <Loading />;
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-2">{recipe.title}</h1>
      <RecipeItem recipe={recipe} />
      <Link href={`/recipes`} className="text-sm underline">
        すべてのレシピを見る
      </Link>
      <Link href={`/talkRoom/${talkRoomId}`} className="text-sm underline">
        会話に戻る
      </Link>
    </main>
  );
}
