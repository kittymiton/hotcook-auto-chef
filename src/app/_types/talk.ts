/**
 * DBに保存される会話ログの型 UIで使用
 */
export type Talk = {
  id: number;
  content: string; // 自然文 or JSON文字列（AIレシピ）
  sender: 'USER' | 'CHEF';
  isReciped: boolean;
};

/**
 * AI返答全文（自然文＋JSONブロック）を解析し、UIやDB処理で扱いやすい形へ分解
 */
export type ParsedContent = {
  prefix: string;
  recipe: Record<string, any> | null;
  suffix: string;
};
