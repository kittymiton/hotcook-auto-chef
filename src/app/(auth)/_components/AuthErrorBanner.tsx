'use client';

import type { UseAuthForm } from '@/types/auth';
import Link from 'next/link';

/**
 * 表示専用 日本語化message/切り替え文言
 * 認証関連のエラー表示集約/再送導線
 *
 * errorInfo(status, message)に基づきUIを切り替え
 *  - 403: メール未確認 → 再送ボタン表示、onResendセット
 *  - 409: ユーザー既登録 → ログインリンク表示
 *  - 500: サーバー障害 → 再試行案内
 *  - その他: 汎用エラーメッセージ
 *
 * @param props.errorInfo - エラー情報のオブジェクト。errorInfo.messageがそのまま表示（nullの場合は非表示）
 * @param props.onResend - 未認証メール時の再送ハンドラー（任意）
 * @param props.reSending - 再送中フラグ（任意）
 * @returns 認証エラーがある場合はエラーメッセージを含むJSX。ない場合はnullを返し、UIに何も描画しない
 */
type AuthErrorBannerProps = Partial<UseAuthForm> & {
  errorInfo: UseAuthForm['errorInfo']; // UseAuthFormの全プロパティを?にし、[]のプロパティを必須として明示的に上書き
};

export const AuthErrorBanner = ({
  errorInfo,
  email,
  setEmail,
  formErrors,
  resendControls = {
    showResend: false,
    requireEmail: false,
    reSending: false,
    onResend: undefined,
  },
}: AuthErrorBannerProps): JSX.Element | null => {
  // なにもエラーがない初回はバナーを出さない
  if (!errorInfo) return null;
  const { requireEmail, reSending, onResend, showResend } = resendControls;

  switch (errorInfo.status) {
    // メール認証未完了（ユーザー列挙防止の為返答は常に同じメッセージ）
    case 403:
      return (
        <div>
          <p>{errorInfo.message}</p>
          {showResend && (
            <>
              <p>
                メールが届かない方は、
                {requireEmail ? '以下のフォーム' : '以下のボタン'}
                から再送できます。
              </p>
              {requireEmail && (
                <div>
                  <label htmlFor="email">メールアドレス</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    onChange={(e) => setEmail?.(e.target.value)}
                    value={email ?? ''}
                  />
                  {formErrors?.email && (
                    <p style={{ color: 'red' }}>※{formErrors.email}</p>
                  )}
                </div>
              )}
              {onResend && (
                // !!でbooleanを保証 true→ボタン有効/false→無効
                <button
                  type="button"
                  onClick={() => email && onResend?.()}
                  aria-busy={!!reSending}
                  aria-disabled={!!reSending}
                >
                  {reSending ? '再送中' : 'メール再送信'}
                </button>
              )}
            </>
          )}
        </div>
      );

    // 既に登録済み
    case 409:
      return (
        <div>
          <span>
            {errorInfo.message}
            {''}
            {/* <Link href="/login">ログイン</Link>してください */}
          </span>
        </div>
      );
    case 500:
      return (
        <div>
          <p>{errorInfo.message}</p>
          お問い合わせは<Link href="">こちら</Link>
        </div>
      );
    default:
      return (
        <div>
          <p>{errorInfo.message}</p>
        </div>
      );
  }
};
