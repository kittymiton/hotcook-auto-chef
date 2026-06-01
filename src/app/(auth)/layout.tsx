'use client';

import { useEffect } from 'react';
import { Header } from '../_components/header/Header';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    fetch('/api/warmup');
  }, []);

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-[960px]">{children}</main>
    </>
  );
}
