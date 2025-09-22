'use client';

import {
  HOME_PATH,
  LOGIN_ERROR_PATH,
  LOGIN_PATH,
  SIGNUP_PATH,
} from '@/constants/index';
import { GuestMenu } from '@auth/components/GuestMenu';
import { LoginHeader } from '@auth/components/LoginHeader';
import { SignupHeader } from '@auth/components/SignupHeader';
import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import { usePathname } from 'next/navigation';

/**
 * ルートレイアウトコンポーネント
 * サイト全体の構造・共通関数を定義
 * @param props - childrenを受け取りアプリ全体のラッパーとして表示
 * @returns {JSX.Element}アプリ全体のHTMLレイアウト
 */
// TODO: フロント実装のブランチでヘッダー切替をGuestHeaderSwitcherに集約したコンポーネント化→useclientをはずす、usePathnameでエラーになるのでコンポーネントに処理を分離してサーバーコンポーネント化する
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { session, isLoading } = useSupabaseSession();
  const pathname = usePathname();
  return (
    <html>
      <head />
      <body>
        <header>
          {!session && !isLoading && (
            <>
              {pathname === HOME_PATH && <GuestMenu />}
              {pathname === SIGNUP_PATH && <LoginHeader />}
              {pathname === LOGIN_ERROR_PATH && <LoginHeader />}
              {pathname === LOGIN_PATH && <SignupHeader />}
            </>
          )}
        </header>
        <main>
          {/* <EmailProvider>{children}</EmailProvider>//安全上使用しない設計に変更、雛形のためにとっておく */}
          {children}
        </main>
      </body>
    </html>
  );
}
