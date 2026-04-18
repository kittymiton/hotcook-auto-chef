import type { RecipeBaseList } from '@/lib/validators/recipeSchema';
import Link from 'next/link';

type RecipeListProps = {
  recipes: RecipeBaseList;
  talkRoomId: number;
};

export const AsideRecipeList = ({ recipes, talkRoomId }: RecipeListProps) => {
  return (
    <>
      <ul className="mb-2 space-y-1">
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <Link
              href={`/recipes/${recipe.id}?from=${talkRoomId}`}
              className="text-blue-600 hover:underline"
            >
              {recipe.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};
