'use client';

import { UseAuthForm } from '@/types/auth';
import { AuthErrorBanner } from '@auth/components//AuthErrorBanner';

/**
 * フォーム入力・表示
 * 内部にAuthErrorBannerにerrorInfo、onResend、sendingを渡す
 *
 * @param props フォームの入力状態と検証・エラー表示に必要な情報
 *   - email, password: 入力中の値
 *   - setEmail, setPassword: 入力更新ハンドラー
 *   - formErrors: 各フィールドのバリデーションメッセージ
 *   - errorInfo: 認証処理から返されたエラー情報（正規化済みエラーオブジェクト、null可で子に渡すのみ）
 *   - resendControls: メール再送制御（子に渡すのみ）
 * @returns {JSX.Element} 子要素ラップ（メール/パスワード入力欄、AuthErrorBanner）
 *
 */
type AuthFieldProps = Pick<
  UseAuthForm,
  | 'email'
  | 'password'
  | 'formErrors'
  | 'errorInfo'
  | 'setEmail'
  | 'setPassword'
  | 'resendControls'
>;

export const AuthFields = ({
  email,
  password,
  formErrors,
  setEmail,
  setPassword,
  errorInfo,
  resendControls,
}: AuthFieldProps) => {
  return (
    <div>
      <div>
        <label htmlFor="email">メールアドレス</label>
        <input
          type="email"
          name="email"
          id="email"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        {formErrors.email && <p>※{formErrors.email}</p>}
      </div>
      <div>
        <label htmlFor="password">パスワード</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="●●●●●●●●●"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        {formErrors.password && <p>※{formErrors.password}</p>}
      </div>
      <AuthErrorBanner
        errorInfo={errorInfo}
        email={email}
        setEmail={setEmail}
        formErrors={formErrors}
        resendControls={resendControls}
      />
    </div>
  );
};
