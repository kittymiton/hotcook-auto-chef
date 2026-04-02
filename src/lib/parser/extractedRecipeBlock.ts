import { ExtractedRecipeBlock } from '@/types/recipe';

export function extractedRecipeBlock(
  content: string
): ExtractedRecipeBlock | null {
  const extractedBlock = content.match(/```json([\s\S]*?)```/i);
  if (extractedBlock) {
    return {
      block: extractedBlock[0], // 正規表現全文```（開始フェンス）、改行、JSON、改行、```
      recipeJson: extractedBlock[1].trim(), // ()で切り出した部分（JSON中身）
      index: extractedBlock.index!, // ```jsonブロックの開始位置
    };
  }

  const fallbackBlock = content.match(/{[\s\S]*"レシピタイトル"[\s\S]*}/);
  if (fallbackBlock) {
    return {
      block: fallbackBlock[0],
      recipeJson: fallbackBlock[0].trim(),
      index: fallbackBlock.index!,
    };
  }
  return null;
}
