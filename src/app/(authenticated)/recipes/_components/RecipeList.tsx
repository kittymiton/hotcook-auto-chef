import type { RecipeSummaryList } from '@/lib/schema/recipeSchema';
import { RecipePoint } from '@authenticated/components/recipe/RecipePoint';
import { RecipeTag } from '@authenticated/components/recipe/RecipeTag';
import { RecipeTitle } from '@authenticated/components/recipe/RecipeTitle';
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
                    <RecipeTitle title={recipe.title} variant="compact" />
                    <div className="flex items-start gap-1">
                      {recipe.point && `💡`}
                      <RecipePoint point={recipe.point} />
                    </div>
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
