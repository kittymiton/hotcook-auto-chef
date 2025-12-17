/**
 * OpenAI APIに送るためのメッセージ形式
 */
export type ChatMessage = {
  role: 'user' | 'assistant'; // systemメッセージはプロンプトで埋め込まれているので不要
  content: string; // 自然文 or JSON文字列（AIレシピ）
};

/**
 * CHEFが生成した返答全文をtalkDBに保存するときのフォーマット
 * - AIが返したそのままの文字列（自然文＋JSONブロック）
 */
export type HotcookResult = {
  content: string;
};

/**
 * AI返答全文（自然文＋JSONブロック）を解析し、UIやDB処理で扱いやすい形へ分解
 */
export type ParsedContent = {
  prefix: string;
  recipe: Record<string, any> | null;
  suffix: string;
};
