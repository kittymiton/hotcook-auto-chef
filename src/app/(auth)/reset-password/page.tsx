'use client';

import { ResetPasswordForm } from '@auth/components/forms/ResetPasswordForm';
/**
 * パスワード変更ページ（未ログイン時）
 *
 * @returns {JSX.Element}
 */
export default function ResetPasswordPage() {
  return (
    <div>
      <ResetPasswordForm />
    </div>
  );
}
