'use client';

import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import { UserMenu } from '@authenticated/components/UserMenu';
import { useRouteGuard } from '@authenticated/hooks/useRouteGuard';

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
    return <div>ログインしてください</div>;
  }

  return (
    <div>
      <header>
        <UserMenu />
      </header>
      <main>{children}</main>
    </div>
  );
}
