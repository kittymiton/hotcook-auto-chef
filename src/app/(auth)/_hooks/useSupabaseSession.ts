'use Client';

import { supabase } from '@/lib/utils/env';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

/**
 * ログイン認証を取得するフック
 * @returns
 *  session - ログイン状態
 *  token - ログインしている場合のアクセストークン
 *  isLoding - ログイン状態のロード中かどうか
 **/
export const useSupabaseSession = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined); // undefind: ログイン状態ロード中
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetcher = async (): Promise<void> => {
      const {
        data: { session },
        // ログイン中かどうかのチェック
      } = await supabase.auth.getSession();

      setSession(session);
      setToken(session?.access_token || null);
      setIsLoading(false);
    };
    fetcher();
  }, []);
  return { session, isLoading, token };
};
