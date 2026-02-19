'use client';

import {
  HOME_PATH,
  LOGIN_ERROR_PATH,
  LOGIN_PATH,
  SIGNUP_PATH,
} from '@/constants/index';
import { GuestMenu } from '@auth/components/header/GuestMenu';
import { LoginHeader } from '@auth/components/header/LoginHeader';
import { SignupHeader } from '@auth/components/header/SignupHeader';
import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import './globals.css';

/**
 * アプリ全体のルートレイアウト
 * - ページ初回ロード時に/api/warmupを呼び出し、SupabaseDBのコールドスタートを防ぐ。
 * - すべてのページで共通となるHTML構造とメタデータを提供
 * @param props - childrenを受け取りアプリ全体のラッパーとして表示
 */
// TODO: フロント実装のブランチでヘッダー切替をGuestHeaderSwitcherに集約したコンポーネント化→useclientをはずす、usePathnameでエラーになるのでコンポーネントに処理を分離してサーバーコンポーネント化する
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { session, isLoading } = useSupabaseSession();
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/warmup');
  }, []);

  return (
    <html lang="ja" className="h-full">
      <head />
      <body className="h-full">
        <header>
          {/* {!session && !isLoading && ( */}
          {!isLoading && (
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
