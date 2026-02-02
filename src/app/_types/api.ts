import { RecipeSummary } from '@/types/recipe';

// POST UI→API
export type OpenAIRequest = {
  content: string;
  talkRoomId: number;
};

// API→外部API
export type OpenAIChatRequest = {
  role: 'user' | 'assistant';
  content: string;
};

// 外部API→API（成功）
export type OpenAIChatResponse = {
  content: string;
};

/**
 * レシピ取得関連 (GET /api/recipes)
 */
// asaideに表示するフロントからバックへのリクエストの型
export type RecipeListQuery = {
  talkRoomId?: number;
  take?: number;
};

// バックからフロントへ
export type RecipeListResponse = {
  recipes: RecipeSummary[];
};
