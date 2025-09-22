'use client';

import { LOGIN_PATH } from '@/constants/index';
import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * 認証チェック、未ログインのアクセス制限（認可）を判定するフック
 * 初回レンダリング時に発火、ページ遷移時にも発火してログインを促す
 */
export const useRouteGuard = () => {
  const router = useRouter();
  const { session, isLoading } = useSupabaseSession();

  useEffect(() => {
    // セッション読み込み中、ロード中（実行タイミングガード メールリンク認証直後のtoken同期ラグ、未取得）
    if (session === undefined || isLoading) return;
    const featcher = async (): Promise<void> => {
      // 未ログイン
      if (session === null) {
        router.replace(LOGIN_PATH);
      }
    };
    featcher();
  }, [router, session, isLoading]);
};
