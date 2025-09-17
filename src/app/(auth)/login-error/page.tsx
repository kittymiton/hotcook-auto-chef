'use client';

import { HOME_PATH } from '@/constants/index';
import { AuthErrorBanner } from '@auth/components/AuthErrorBanner';
import { useAuthForm } from '@auth/hooks/useAuthForm';
import Link from 'next/link';

/**
 * 未認証状態でログインしようとした際に遷移するエラーページ（認証トークンが無効/期限切れなど）
 * 異常時に画面が真っ白になるのを防止
 * 子コンポーネント経由で制御
 * @returns {JSX.Element}<AuthErrorBanner />レンダリング
 */
export default function LoginErrorPage() {
  const {
    email,
    setEmail,
    formErrors,
    errorInfo, // useAuthFormから受け取った加工済みのエラー情報
    resendControls,
  } = useAuthForm('login', { initialError: 'url_auth_error' }); // 'login'文脈を流用

  // searchParams/hashエラーを固定メッセージで渡す
  // const errorInfo = useMemo(
  //   () => getAuthErrorInfo({ message: 'url_auth_error', status: 403 }, 'login'),
  //   []
  // );

  return (
    <div>
      <h1>メール確認が必要です</h1>
      <AuthErrorBanner
        errorInfo={errorInfo}
        resendControls={resendControls}
        email={email}
        setEmail={setEmail}
        formErrors={formErrors}
      />
      <Link href={HOME_PATH}>TOP</Link>
    </div>
  );
}
