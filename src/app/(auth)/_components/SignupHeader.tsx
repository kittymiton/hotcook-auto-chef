'use client';

import { SIGNUP_PATH } from '@/constants/index';
import Link from 'next/link';

/**
 * ログインページのヘッダー
 * @returns {JSX.Element}（会員登録へのリンク）
 */
export const SignupHeader = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link href={SIGNUP_PATH}>会員登録</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};
