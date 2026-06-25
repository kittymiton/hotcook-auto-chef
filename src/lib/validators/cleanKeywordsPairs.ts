import type { AiKeywords } from '@/lib/schema/recipeBlockSchema';

// 表示用と検索用が揃っているキーワードだけ保存対象にする
export function cleanKeywordsPairs(keywords: AiKeywords): AiKeywords {
  return keywords
    .map((word) => ({
      keyword: word.keyword?.normalize('NFKC').trim() ?? '',
      normalizedKeyword: word.normalizedKeyword?.normalize('NFKC').trim() ?? '',
    }))
    .filter((word) => word.keyword && word.normalizedKeyword)
    .slice(0, 2);
}
