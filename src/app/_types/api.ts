import { RecipeSummary } from '@/types/recipe';
import { Talk } from '@/types/talk';
/* 通信リクエスト */

/**
 * チャット送信関連 (POST /api/openai)
 */
// フロントからリクエスト
export type OpenAIRequest = {
  content: string;
  talkRoomId: number;
};

// バックエンドからOpenAI API（外部）へリクエスト (AI用フォーマット)
export type ChatMessage = {
  role: 'user' | 'assistant'; // systemメッセージはプロンプトで埋め込まれているので不要
  content: string; // 自然文 or JSON文字列（AIレシピ）
};

// AIが生成した返答全文ログ talkDB用フォーマット
export type OpenAIResult = {
  content: string; // AIが返したそのままの文字列（自然文＋JSONブロック）
};

// バックからフロントへの返信（成功時）
export type OpenAIResponse = {
  talk: Talk;
  recipeId?: number;
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
