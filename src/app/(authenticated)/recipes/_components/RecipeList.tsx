import type { RecipeSummaryList } from '@/lib/schema/recipeSchema';
import { RecipeTag } from '@authenticated/components/recipe/RecipeTag';
import Link from 'next/link';
import { Surface } from '../../../../components/ui/Surface';

type Props = {
  recipes: RecipeSummaryList;
};

export const RecipeList = ({ recipes }: Props) => {
  return (
    <>
      <ul className="space-y-4">
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <Link href={`/recipes/${recipe.id}`}>
              <Surface variant="recipe-list-item">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <section>
                    <h2 className="text-lg font-semibold hover:underline">
                      {recipe.title}
                    </h2>

                    {/* {recipe.cookingTime && (
                      <p className="text-sm">調理時間: {recipe.cookingTime}</p>
                    )}

                    <ul className="mb-1 flex flex-wrap gap-2">
                      {recipe.tags.map((tag: string) => (
                        <li key={tag}>
                          <RecipeTag keyword={tag} />
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </Surface>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};
