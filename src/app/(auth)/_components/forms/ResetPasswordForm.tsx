'use client';

import { useResetPasswordForm } from '@auth/hooks/useResetPasswordForm';

/**
 * パスワード変更ページ UI（未ログイン時）
 *  - パスワード変更のためのリンク発行用にemail入力→送信ボタン表示
 *
 * @returns {JSX.Element}
 */
export const ResetPasswordForm = () => {
  const {
    register,
    handleSubmit,
    isDirty,
    errors,
    isSubmitting,
    redirecting,
    onSubmit,
  } = useResetPasswordForm();

  return (
    <div>
      <h1>パスワード再設定用メール送信</h1>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        aria-busy={isSubmitting}
      >
        <label htmlFor="email">メールアドレス</label>
        <div>
          <input type="email" id="email" required {...register('email')} />
          {errors.email && <p>{errors.email.message}</p>}
          <button
            type="submit"
            disabled={!isDirty || isSubmitting || redirecting}
          >
            {isSubmitting || redirecting ? '送信中' : '送信'}
          </button>
          {redirecting && (
            <p className="mt-4 text-center text-gray-500 animate-pulse">
              処理中...
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
