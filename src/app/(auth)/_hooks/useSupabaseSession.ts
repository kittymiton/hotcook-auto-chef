'use Client';

import { supabase } from '@/lib/utils/env';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

/**
 * 初回ログイン状態/リフレッシュを取得するフック
 * @returns
 *  session - ログイン状態
 *  token - ログイン状態でのアクセストークン
 *  isLoding - ログイン状態のロード中かどうか
 **/
export const useSupabaseSession = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined); // undefind: ログイン状態ロード中
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 初回ロード
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setToken(data.session?.access_token ?? null);
      setIsLoading(false);
    };

    init();

    // スリープ復帰を監視して常に最新sessionを見る
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession); // 最新のアクセストークンを持つ
        setToken(newSession?.access_token ?? null);
      }
    );

    // ページを離れた瞬間クリーンアップ
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { session, isLoading, token };
};
