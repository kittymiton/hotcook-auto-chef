import type { RecipeSummaryList } from '@/lib/validators/recipeSchema';
import Link from 'next/link';

type RecipeListProps = {
  recipes: RecipeSummaryList;
  talkRoomId: number;
  cookingTime?: boolean;
};

export const RecipeList = ({
  recipes,
  talkRoomId,
  cookingTime,
}: RecipeListProps) => {
  return (
    <>
      <ul className="space-y-4">
        {recipes.map((recipe) => (
          <li
            key={recipe.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <Link
              href={`/recipes/${recipe.id}?from=${talkRoomId}`}
              prefetch={false}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                    {recipe.title}
                  </h2>

                  {cookingTime && recipe.cookingTime && (
                    <p className="text-sm">調理時間: {recipe.cookingTime}</p>
                  )}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};
