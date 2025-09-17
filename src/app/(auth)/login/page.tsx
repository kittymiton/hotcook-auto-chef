'use client';

import { AuthScreen } from '@auth/components/AuthScreen';

/**
 * loginページ
 * @returns {JSX.Element}<AuthScreen />レンダリング
 */
export default function LoginPage() {
  return (
    <div>
      <AuthScreen type="login" />
    </div>
  );
}
