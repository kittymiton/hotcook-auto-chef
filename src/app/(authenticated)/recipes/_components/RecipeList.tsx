import type { RecipeSummaryList } from '@/lib/validators/recipeSchema';
import Link from 'next/link';

type RecipeListProps = {
  recipeList: RecipeSummaryList;
  from?: string | null;
};

export const RecipeList = ({ recipeList, from }: RecipeListProps) => {
  return (
    <ul className="space-y-4">
      {recipeList.map((recipe) => (
        <li
          key={recipe.id}
          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <Link
            href={
              from
                ? `/recipes/${recipe.id}?from=${from}`
                : `/recipes/${recipe.id}`
            }
            prefetch={false}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                  {recipe.title}
                </h2>
                <p className="text-sm">調理時間: {recipe.cookingTime}</p>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};
