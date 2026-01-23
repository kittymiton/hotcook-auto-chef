export function normalizeForAI(text: string): string {
  return text
    .trim()
    .replace(/[ \t]+/g, ' ') // 半角スペースorタブが2つ以上連続→半角スペース1つに置き換え
    .replace(/\n{3,}/g, '\n\n'); // 連続する改行を最大2つまでに圧縮
}
