'use client';

import { AuthScreen } from '@auth/components/AuthScreen';

/**
 * signupページ
 * @returns {JSX.Element}<AuthScreen />レンダリング
 */
export default function SignUpPage() {
  return (
    <div>
      <AuthScreen type="signup" />
    </div>
  );
}
