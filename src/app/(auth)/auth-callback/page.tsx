'use client';

import { LOGIN_ERROR_PATH, LOGIN_PATH } from '@/constants/index';
import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import { upsertUserRoom } from '@auth/lib/upsertUserRoom';
import { hasAuthErrorInUrl } from '@auth/lib/utils/hasAuthErrorInurl';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Supabaseのセッションを確認して必ず遷移する認証CBページ
 * このページ自体にはUIはなく、処理が完了次第すぐにリダイレクト
 * 常時URLエラー監視
 *
 * 1. 認証セッションの検証（セッションがなければ/loginへリダイレクト）
 * 2. upsertUser呼び出し（DBにユーザーがなければ登録/ユーザーに紐づくトークルーム取得・作成）
 * 3. 完了後、トークルームページ(`/talkRoom/:id`)にリダイレクト
 *
 * @redirects
 * - 未認証: /auth/loginへ遷移
 * - 認証済: APIから返ったトークルームIDを使って/talkRoom/:idへ遷移
 **/
export default function AuthCallbackPage() {
  const router = useRouter();
  const { session, isLoading } = useSupabaseSession();

  // あらゆるケースでisLoading=falseかつsessionが取得済みまで動かさない
  useEffect(() => {
    // マウント前にエラーを判定
    if (typeof window !== 'undefined' && hasAuthErrorInUrl()) {
      router.replace(LOGIN_ERROR_PATH);
      return;
    }

    // セッションが確定していない場合は抜ける
    const init = async (): Promise<void> => {
      if (isLoading || !session) return;

      // URLに認証エラーの痕跡があるかだけチェック
      if (hasAuthErrorInUrl()) {
        router.replace(LOGIN_ERROR_PATH);
        return;
      }

      try {
        if (session) {
          const talkRoom = await upsertUserRoom(session);
          router.replace(`/talkRoom/${talkRoom.id}`);
        }
      } catch (error) {
        router.replace(LOGIN_PATH);
        console.error('upsertUserRoomエラー:', error);
      }
    };
    init();

    // URLの認証エラーに変更がないか念の為監視
    const hashListener = () => {
      if (hasAuthErrorInUrl()) {
        router.replace(LOGIN_ERROR_PATH);
      }
    };
    window.addEventListener('hashchange', hashListener);

    return () => {
      window.removeEventListener('hashchange', hashListener);
    };
  }, [session, isLoading, router]);
}
