export function findRecipeBlock(chefContent: string): string | null {
  const recipeBlockMatch = chefContent.match(/```json([\s\S]*?)```/i);
  return recipeBlockMatch ? recipeBlockMatch[1].trim() : null;
}
