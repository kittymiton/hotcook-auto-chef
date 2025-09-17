import type { AuthErrorInfo, AuthType } from '@/types/auth';
import type { AuthError } from '@supabase/supabase-js'; // supabaseの返却する生エラー

/**
 * SupabaseのAuthErrorを、UI表示用に標準化する純粋関数（文字列→構造体）
 * 複数のエラー形式（AuthError, status, message, STRING）をAuthErrorInfo形式で統一的に処理
 *
 *  - 日本語に整形
 *  - nullや不正な形式にも対応し、fallbackを返す
 * @returns message - ユーザーへの表示
 * @returns status - UI分岐用に独自マッピング
 * @returns null - エラーなし
 */
// 生エラーを受け取り、AuthErrorInfoに変換
export const getAuthErrorInfo = (
  error: AuthError | { message?: string } | { status?: number } | string | null,
  type: AuthType
): AuthErrorInfo | null => {
  if (!error) return null;

  // 型ガード（errorオブジェクトにmessageが文字列で存在するかを確認）
  const key: string | undefined =
    typeof error === 'string'
      ? error
      : typeof error === 'object' &&
          error !== null &&
          'message' in error &&
          typeof error.message === 'string'
        ? error.message
        : 'undefind';

  switch (key) {
    // 未登録/パス違い
    case 'Invalid login credentials':
      return {
        message: 'アカウントが存在しないか、パスワードが違います。',
        status: 401,
      };

    // 登録＋PW一致＋未認証
    case 'Email not confirmed':
      return {
        message:
          'メール認証が未完了です。メール内のリンクをクリックし、登録を完了させてください。',
        status: 403, // 強制上書き
      };

    // 古い/無効なリンク
    case 'url_auth_error': // original固定
      return {
        message: 'リンクの有効期限が過ぎています。',
        status: 403, // 強制上書き
      };

    case 'User already registered':
      return {
        message: 'すでに登録されています。ログインしてください。',
        status: 409,
      };

    case 'unexpected_failure':
      return {
        message: '登録に失敗しました。時間をおいて再度お試しください。',
        status: 500,
      };

    // key を特定できないとき
    default:
      return {
        message:
          type === 'login'
            ? 'ログインできませんでした'
            : '登録に失敗しました。',
        status: 400,
      };
  }
};
