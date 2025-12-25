/**
 * UI用にパース済みのレシピ構造
 * - フロント専用の整形済オブジェクト
 * - DB保存前の生データとは異なる
 * - トークルームページ（talkRoomIdPage）でレシピ表示に使用
 */
export type ParsedRecipe = {
  レシピタイトル: string;
  ポイント: string;
  調理時間: string;
  '材料（2人分）': string[];
  作り方: string[];
};

/**
 * レシピの最小構造を共通基礎型とした他の型の土台
 * - トークルームページ（talkRoomIdPage）のasideの最近のレシピ一覧
 * - RecipeSummary / RecipeDetail の共通部分
 */
export type RecipeBase = {
  id: number;
  title: string;
};

/**
 * 高速に一覧取得したい用途向け軽量データ
 * - RecipeBaseに調理時間と画像キーを追加した拡張型
 * - レシピ一覧ページ（recipeListPage）で使用
 */
export type RecipeSummary = RecipeBase & {
  cookingTime?: string;
  imageKey?: string;
};

/**
 * 完全版レシピ型
 * DB保存されている実データをそのまま表す
 * - レシピ詳細ページ（recipeIdPage）で使用
 */
export type RecipeDetail = RecipeBase & {
  point?: string;
  cookingTime?: string;
  ingredients: string; // JSON文字列
  instructions: string; // JSON文字列
  imageKey?: string;
};

/**
 * レシピブロックを取得
 */
export type ExtractedJson = {
  full: string;
  inner: string;
};
