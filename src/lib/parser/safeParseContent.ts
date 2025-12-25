import { extractJsonBlock } from '@/lib/parser/extractJsonBlock';
import type { ParsedContent } from '@/types/talk';

/**
 * UI用に文字列を解析し、JSONコードブロックを抽出しprefix/suffixに分離する
 * - talkRoomId.page
 * @param {string} content - 解析対象の文字列
 * @returns { ParsedContent | null} - 分離されたprefix, recipe(パースされたJSONオブジェクト), suffix
 **/
export const safeParseContent = (content: string): ParsedContent => {
  const block = extractJsonBlock(content);

  let recipe: Record<string, any> | null = null;
  let prefix = '';
  let suffix = '';

  if (block) {
    try {
      recipe = JSON.parse(block.inner);
    } catch (err) {
      console.error('JSON parse error:', err);
    }

    const [before, after] = content.split(block.full);
    // JSONブロックの開始マーカー先頭末尾の改行除去
    prefix = before.replace(/^\n+|\n+$/g, '');
    suffix = after.replace(/^\n+|\n+$/g, '');
  } else {
    // JSONブロックがない場合はそのまま自然文
    prefix = content;
  }
  return { prefix, recipe, suffix };
};
