'use client';

import { LOGIN_PATH, SIGNUP_PATH } from '@/constants/index';
import Link from 'next/link';

/**
 * TOPページのヘッダー
 * @returns {JSX.Element}(ログイン/会員登録 リンク)
 */
export const GuestMenu = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link href={LOGIN_PATH}>ログイン</Link>
          </li>
          <li>
            <Link href={SIGNUP_PATH}>会員登録</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};
