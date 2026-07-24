import { stepsItemForParse } from '@/lib/parser/stepsItemForParse';
import type { RecipeDetail } from '@/lib/schema/recipeSchema';
import { RecipeCookingTime } from '@authenticated/components/recipe/RecipeCookingTime';
import { RecipeIngredients } from '@authenticated/components/recipe/RecipeIngredients';
import { RecipeInstructions } from '@authenticated/components/recipe/RecipeInstructions';
import { RecipePoint } from '@authenticated/components/recipe/RecipePoint';
import { RecipeTag } from '@authenticated/components/recipe/RecipeTag';
import Image from 'next/image';

type Props = {
  recipe: RecipeDetail;
};

// 保存済みレシピの詳細・編集画面
export const RecipeItem = ({ recipe }: Props) => {
  const itemsBlock = stepsItemForParse(recipe.ingredients, recipe.instructions);

  return (
    <>
      <h1 className="mt-2 pt-2 text-2xl font-bold">{recipe.title}</h1>

      <RecipePoint point={recipe.point} />
      <RecipeCookingTime cookingTime={recipe.cookingTime || '不明'} />

      <section>
        <RecipeIngredients ingredients={itemsBlock.ingredients} />
        <RecipeInstructions instructions={itemsBlock.instructions} />

        <h3 className="mb-2 text-sm font-semibold">キーワード</h3>
        <ul className="mb-4 flex flex-wrap gap-2">
          {recipe.tags.map((tag: string) => (
            <li key={tag}>
              <RecipeTag keyword={tag} />
            </li>
          ))}
        </ul>
      </section>

      {recipe.imageKey && (
        <Image
          src={`/images/${recipe.imageKey}`}
          alt={recipe.title}
          width={240}
          height={260}
          className="mb-4 rounded-lg shadow"
        />
      )}
    </>
  );
};
