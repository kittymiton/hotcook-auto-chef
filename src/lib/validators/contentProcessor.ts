export function sanitize(userInput: string): string {
  return userInput
    .replace(/[ \t　]+/g, ' ') // スペースの集約
    .replace(/\n{2,}/g, '\n\n') // 改行は2つまで許容（読みやすさのため）
    .replace(/([\s\S])\1{2,}/gu, '$1') // 3文字以上の連打は1つに
    .replace(/ー{2,}/g, 'ー') // 長音（ー）の連打も1つに
    .trim();
}

export function substantial(userInput: string): boolean {
  const core = userInput
    .replace(/[^\p{L}\p{N}]/gu, '') // 記号消去
    .replace(/\p{Extended_Pictographic}/gu, '') // 絵文字消去
    .trim();
  return /\p{L}/u.test(core); // 文字（\p{L}）があるかチェック
}
