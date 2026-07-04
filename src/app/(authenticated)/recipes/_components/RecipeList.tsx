import type { RecipeSummaryList } from '@/lib/schema/recipeSchema';
import Link from 'next/link';
import { Tag } from '../../../../components/Tag';

type Props = {
  recipes: RecipeSummaryList;
  cookingTime?: boolean;
};

export const RecipeList = ({ recipes, cookingTime }: Props) => {
  return (
    <>
      <ul className="space-y-4">
        {recipes.map((recipe) => (
          <li
            key={recipe.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <Link href={`/recipes/${recipe.id}`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                    {recipe.title}
                  </h2>

                  {cookingTime && recipe.cookingTime && (
                    <p className="text-sm">調理時間: {recipe.cookingTime}</p>
                  )}

                    <ul className="mb-1 flex flex-wrap gap-2">
                      {recipe.tags.map((tag: string) => (
                        <li key={tag}>
                          <Tag keyword={tag} />
                        </li>
                      ))}
                    </ul>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};
