'use client';

import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import { UserMenu } from '@authenticated/components/UserMenu';
import { useRouteGuard } from '@authenticated/hooks/useRouteGuard';

/**
 * ログイン済みユーザー専用の共通レイアウト
 * - 認証ガード（useRouteGuard）を内包し、未ログイン時の不正アクセスを防止
 * - 共通ヘッダーの表示と、子要素（children）のコンテンツ領域への配置を担当
 * @param children - このレイアウトに包み込まれるページ内容（JSX）
 */
export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRouteGuard();
  // ページ全体の表示/非表示を切り替え
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
