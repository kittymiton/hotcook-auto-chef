'use client';

import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import { UserMenu } from '@authenticated/components/UserMenu';
import { useRouteGuard } from '@authenticated/hooks/useRouteGuard';

/**
 * ログイン済みユーザ向けページのレイアウト
 * /authenticated以下（children）にレイアウトを提供
 *
 * ページ初回マウント、ページ遷移で再評価
 * useRouteGuard() - ログイン限定エリア（認可）
 * @param children - このレイアウトに挟まれるページ内容（JSX）
 * @returns {JSX.Element}（ヘッダー,{children}）
 **/
export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRouteGuard();
  const { session, isLoading } = useSupabaseSession();

  // セッション確定前に無駄な描画を防ぐ
  if (isLoading) {
    return <div>処理中です・・・</div>;
  }
  // 未ログイン早期リターン
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
