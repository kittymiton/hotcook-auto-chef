'use client';

import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import { UserMenu } from '@authenticated/components/UserMenu';
import { useRouteGuard } from '@authenticated/hooks/useRouteGuard';

/**
 * ログイン済みユーザー向けのレイアウトを提供
 * - authenticated配下のページに共通レイアウト（ヘッダー+コンテンツ領域）を適用
 * - ページ初回マウント・ルート遷移時にuseRouteGuard()を実行し、未ログインユーザーを保護
 * - 認可チェック後、childrenがレイアウトに挟み込まれて描画
 * @param children - このレイアウトに包み込まれるページ内容（JSX）
 * @returns レイアウト済みのUI（ヘッダー+children）
 */
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
