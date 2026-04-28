import type { RecipeBaseList } from '@/lib/schema/recipeSchema';
import Link from 'next/link';

type Props = {
  recipes: RecipeBaseList;
};

export const AsideRecipeList = ({ recipes }: Props) => {
  return (
    <>
      <ul className="mb-2 space-y-1">
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <Link
              href={`/recipes/${recipe.id}`}
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
