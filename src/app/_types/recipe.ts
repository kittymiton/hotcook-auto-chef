// AIの回答を分割表示するためのロジックで用いる型
export type ExtractedRecipeBlock = {
  block: string;
  recipeJson: string;
  index: number;
};
