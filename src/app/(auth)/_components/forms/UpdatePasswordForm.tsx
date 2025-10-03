'use client';

import { useUpdatePasswordForm } from '@auth/hooks/useUpdatePasswordForm';

/**
 * パスワード変更ページ UI（未ログイン時）
 *  - パスワード入力→更新ボタンのUI表示
 *
 * - newPassword：新しいパスワード
 * - confirmPassword：確認用パスワード
 *
 * @returns {JSX.Element}
 */
export const UpdatePasswordForm = () => {
  const {
    register,
    handleSubmit,
    isDirty,
    isValid,
    errors,
    isSubmitting,
    redirecting,
    onSubmit,
  } = useUpdatePasswordForm();

  return (
    <div>
      <h1>パスワード再設定</h1>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        aria-busy={isSubmitting}
      >
        <div>
          <label htmlFor="newPassword">新しいパスワード</label>
          <input
            type="password"
            id="newPassword"
            placeholder="●●●●●●●●●"
            required
            {...register('newPassword')}
          />
          {/* setErrorによってerrorsに登録された情報を表示 */}
          {errors.newPassword && <p>{errors.newPassword.message}</p>}
        </div>
        <div>
          <label htmlFor="confirmPassword">確認パスワード</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="●●●●●●●●●"
            required
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </div>
        <button
          type="submit"
          disabled={!isDirty || !isValid || isSubmitting || redirecting}
        >
          {isSubmitting || redirecting ? '送信中' : '送信'}
        </button>
        {redirecting && (
          <div className="mt-4 text-center text-gray-500 animate-pulse">
            処理中...
          </div>
        )}
      </form>
    </div>
  );
};
