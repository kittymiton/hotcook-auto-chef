import type { ExtractedJson } from '@/types/recipe';

/**
 * JSONコードブロックのコンテンツ（```json ... ``` の中身）を抽出する
 * - safeParseContent.ts（full・・切り出し用の境界が必要なため```を残す）
 * - /api/route.ts（inner・・key-valueを取得）
 * @param {string} content - 検索対象の文字列
 * @returns {ExtractedJson | null} - 抽出されたJSON文字列、または見つからなかった場合はnull
 */
export const extractJsonBlock = (content: string): ExtractedJson | null => {
  const match = content.match(/```json([\s\S]*?)```/i);
  if (!match) return null;

  return {
    full: match[0], // match以下（）全体
    inner: match[1].trim(), // json([\s\S]*?)
  };
};
