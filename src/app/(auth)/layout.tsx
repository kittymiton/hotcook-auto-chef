'use client';

import { useEffect } from 'react';
import { Header } from '../_components/header/Header';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    fetch('/api/warmup').catch(() => {
      // warmupは補助処理のため、失敗しても画面表示には影響させない
    });
  }, []);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[960px]">{children}</main>
    </>
  );
}
