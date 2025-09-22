/**
 * URLから拾う生エラーを検知する汎用ユーティリティ関数（hash/serchParams）
 * （中身の精査まではしない）
 *  - auth-callbackから呼ばれる
 *
 * @returns hasHash（true/false）- エラーあり/なし
 * @returns hasSearch（true/false）- エラーあり/なし
 */
export const hasAuthErrorInUrl = (): boolean => {
  if (typeof window === 'undefined') return false;

  // hash
  // ex) "#error=access_denied&error_code=otp_expired&error_description=..."
  const hash = window.location.hash?.slice(1) ?? '';
  const hashParams = new URLSearchParams(hash);

  // queryParams
  // ex) "?error=..." or "?err=...&desc=..."
  const queryParams = new URLSearchParams(window.location.search);

  const hashParamsKeys = ['error', 'error_code', 'error_description'];
  const queryParamsKeys = ['error', 'error_code', 'error_description'];

  // hashParamsKeysをループしてhashParamsからhashParamsKeyを使って取り出し、一致（flag:truthy）ならtrueを返す
  const hasHash = hashParamsKeys.some((hashParamsKey) =>
    hashParams.get(hashParamsKey)
  );
  const hasSearch = queryParamsKeys.some((queryParamsKey) =>
    queryParams.get(queryParamsKey)
  );
  return hasHash || hasSearch;
};
