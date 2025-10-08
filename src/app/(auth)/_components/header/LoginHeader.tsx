'use client';

import { LOGIN_PATH } from '@/constants/index';
import Link from 'next/link';

/**
 * 会員登録ページのヘッダー
 * @returns {JSX.Element}（ログインページへのリンク）
 */
export const LoginHeader = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link href={LOGIN_PATH}>ログイン</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};
