/**
 * リンクから拾う認証タイプ（type）を検知する汎用ユーティリティ関数（hash）
 * （中身の精査まではしない）
 *  - auth-callbackから呼ばれる
 *
 * @returns type: 'recoverry' | 'signup'
 */

export const getAuthTypeHash = (): string | null => {
  if (typeof window === 'undefined') return null;

  const hash = window.location.hash?.slice(1) ?? '';
  const hashParams = new URLSearchParams(hash);
  return hashParams.get('type');
};
