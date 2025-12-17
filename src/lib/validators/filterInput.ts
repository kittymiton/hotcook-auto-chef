/**
 * ユーザーの入力内容を検証し、無効な入力内容を検出してエラーメッセージを返す
 * @param {string} input ユーザーからの入力内容
 * @returns {string | null} エラーメッセージ
 **/
export const filterInput = (input: string): string | null => {
  // null、空文字列、スペースのみを拒否
  if (!input || input.trim().length === 0) {
    return '入力が無効です。';
  }

  // 日本語文章・句読点・記号を許可
  const validContentRegex = /^[\p{L}\p{N}\p{P}\p{S}\p{Zs}]+$/u;
  if (!validContentRegex.test(input)) {
    // TODO:トーストで出すのと送信時のローディング
    return '無効な文字が含まれています。';
  }
  return null; // エラーなし
};
