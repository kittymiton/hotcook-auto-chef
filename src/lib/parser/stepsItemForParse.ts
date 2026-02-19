import {
  type StepsItemList,
  stepsItemSchema,
} from '@/lib/validators/recipeSchema';

export function stepsItemForParse(
  ingredients: string,
  instructions: string
): StepsItemList {
  const parseObj = {
    ingredients,
    instructions,
  };
  try {
    const parsed = {
      ingredients: JSON.parse(parseObj.ingredients),
      instructions: JSON.parse(parseObj.instructions),
    };
    const result = stepsItemSchema.parse(parsed);
    return result;
  } catch {
    throw new Error('ingredients/instructionsのパースに失敗しました');
  }
}
