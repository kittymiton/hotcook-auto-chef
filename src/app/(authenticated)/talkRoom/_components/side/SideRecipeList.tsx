import type { RecipeBaseList } from '@/lib/schema/recipeSchema';
import { Button } from '../../../../../components/ui/Button';

type Props = {
  recipes: RecipeBaseList;
  showAllRecipesButton?: boolean;
};

export const SideRecipeList = ({ recipes, showAllRecipesButton }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <Button href={`/recipes/${recipe.id}`} variant="side-recipe-item">
              <span>{recipe.title}</span>
            </Button>
          </li>
        ))}
      </ul>
      {showAllRecipesButton && (
        <Button href="/recipes" variant="side-all-recipe">
          <span>すべてのレシピを見る</span>
        </Button>
      )}
    </div>
  );
};
