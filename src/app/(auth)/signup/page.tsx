'use client';

import { AuthScreen } from '@auth/components/AuthScreen';

/**
 * signupページ
 * @returns {JSX.Element}<AuthScreen />レンダリング
 */
export default function SignupPage() {
  return (
    <div>
      <AuthScreen type="signup" />
      {/* <SignupForm /> */}
    </div>
  );
}
