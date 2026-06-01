'use client';

import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import { useRouteGuard } from '@authenticated/hooks/useRouteGuard';
import { Header } from '../_components/header/Header';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRouteGuard();
  const { session, isLoading } = useSupabaseSession();

  if (isLoading) {
    return <div>処理中です・・・</div>;
  }

  if (!session) {
    return <div>ログインが必要です</div>;
  }

  return (
    <div className="relative min-h-screen bg-beige-skin">
      <div className="pointer-events-none absolute inset-0 bg-[url('/images/texture-skin.png')] bg-cover bg-no-repeat opacity-[0.15]" />

      <Header className="relative h-[55px] bg-transparent" />
      {children}
    </div>
  );
}
