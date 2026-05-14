'use client';

import { LOGIN_ERROR_PATH, LOGIN_PATH, SIGNUP_PATH } from '@/constants/index';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/Button';

export const GuestMenu = () => {
  const pathname = usePathname();

  const isLoginPage = pathname === LOGIN_PATH || pathname === LOGIN_ERROR_PATH;
  const isSignupPage = pathname === SIGNUP_PATH;

  return (
    <>
      <nav>
        <ul className="flex gap-[12px]">
          <li>
            {!isLoginPage && (
              <Button href={LOGIN_PATH} variant="header-login">
                ログイン
              </Button>
            )}
          </li>
          <li>
            {!isSignupPage && (
              <Button href={SIGNUP_PATH} variant="header-signup">
                会員登録
              </Button>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
};
