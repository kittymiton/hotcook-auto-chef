/**
 * DBに保存される会話ログの型
 * UIで使用
 */
export type Talk = {
  id: number;
  content: string; // 自然文 or JSON文字列（AIレシピ）
  sender: 'USER' | 'CHEF';
  isReciped: boolean;
};
