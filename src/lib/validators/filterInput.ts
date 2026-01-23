// TODO: UI仕様確定後に型安全な形に修正する
export const filterInput = (input: string): string | null => {
  if (!input || input.trim().length === 0) {
    return '入力が無効です。';
  }

  // 日本語文章・句読点・記号を許可
  const validContentRegex = /^[\p{L}\p{N}\p{P}\p{S}\p{Zs}]+$/u;
  if (!validContentRegex.test(input)) {
    return '無効な文字が含まれています。';
  }
  return null; // エラーなし
};
