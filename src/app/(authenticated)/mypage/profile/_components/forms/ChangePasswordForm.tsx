'use client';

import { useChangePasswordForm } from '@authenticated/profile/hooks/useChangePasswordForm';

/**
 * マイページからのパスワード変更時に表示されるページ
 * パスワード入力→更新ボタンのUI表示
 *
 *  - currentPassword：現在のパスワード
 *  - newPassword：新しいパスワード
 *  - confirmPassword：確認用パスワード
 *
 * @returns {JSX.Element}
 */
export const ChangePasswordForm = () => {
  const {
    register,
    handleSubmit,
    isDirty,
    isValid,
    errors,
    isSubmitting,
    redirecting,
    onSubmit,
  } = useChangePasswordForm();

  return (
    <div>
      <h1>パスワード変更</h1>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)} // RHFのバリデ＋onSubmit
        aria-busy={isSubmitting}
      >
        <div>
          <label htmlFor="currentPassword">現在のパスワード</label>
          <input
            type="password"
            id="currentPassword"
            placeholder="●●●●●●●●●"
            required
            {...register('currentPassword')}
          />
          {errors.currentPassword && <p>{errors.currentPassword.message}</p>}
        </div>
        <div>
          <label htmlFor="newPassword">新しいパスワード</label>
          <input
            type="password"
            id="newPassword"
            placeholder="●●●●●●●●●"
            required
            {...register('newPassword')}
          />
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
