'use client';

import { useEffect } from 'react';
import { Header } from '../_components/header/Header';

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  useEffect(() => {
    fetch('/api/warmup');
  }, []);

  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
