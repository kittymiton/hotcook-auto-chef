'use Client';

import { LOGIN_PATH, SIGNUP_PATH } from '@/constants/index';
import type { AuthType, Copy } from '@/types/auth';
import { AuthFields } from '@auth/components/AuthFields';
import { AuthFormBase } from '@auth/components/AuthFormBase';
import { useAuthForm } from '@auth/hooks/useAuthForm';
import Link from 'next/link';

/**
 * 認証フォームのUI
 * 認証ロジック呼び出し＆文言切り替えハブ
 *
 * - useAuthForm初期化
 * - AuthScreen内部でCOPY[type]を参照し、title/buttonLabel/footerを決定
 * - AuthFormBaseに文言・ハンドラーを渡し、AuthFieldsをchildrenとして組み込む
 * @param AuthType 'signin' | 'login'
 * @returns {JSX.Element}（ログインまたはサインアップ画面全体）
 */

const COPY: Record<AuthType, Copy> = {
  login: {
    title: 'ログイン',
    buttonLabel: 'ログイン',
    footer: (
      <>
        {/* <p>
          パスワードを忘れた方は
          <Link href="/reset-password">こちら</Link>
        </p> */}
        <p>
          アカウントをお持ちでない方は
          <Link href={SIGNUP_PATH}>こちら</Link>
        </p>
      </>
    ),
  },
  signup: {
    title: '会員登録',
    buttonLabel: '登録',
    footer: (
      <>
        <p>
          すでにアカウントをお持ちの方は <Link href={LOGIN_PATH}>こちら</Link>
        </p>
      </>
    ),
  },
};

export const AuthScreen = ({ type }: { type: AuthType }) => {
  const {
    email,
    password,
    formErrors,
    errorInfo,
    setEmail,
    setPassword,
    handleSubmit,
    emailChangedAfterError,
    resendControls,
  } = useAuthForm(type);

  const baseProps = COPY[type]; // {title: '・・' , buttonLabel: '・・' , footer: '・・'}
  const fieldProps = {
    email,
    password,
    formErrors,
    errorInfo,
    setEmail,
    setPassword,
    resendControls,
  };

  return (
    <AuthFormBase
      {...baseProps}
      handleSubmit={handleSubmit}
      errorInfo={errorInfo}
      emailChangedAfterError={emailChangedAfterError}
    >
      <AuthFields {...fieldProps} />
    </AuthFormBase>
  );
};
