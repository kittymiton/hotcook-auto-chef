'use Client';

import { supabase } from '@/lib/utils/env';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export const useSupabaseSession = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined); // undefind: ログイン状態ロード中
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setToken(data.session?.access_token ?? null);
      setIsLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setToken(newSession?.access_token ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { session, isLoading, token };
};
