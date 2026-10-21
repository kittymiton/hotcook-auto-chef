import { swrFetcher } from '@/lib/apiClient/swrFetcher';
import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import useSWR from 'swr';
import z from 'zod';

export function useAuthedSWR<Schema extends z.ZodTypeAny>(
  key: string | null,
  schema: Schema
) {
  const { token, isLoading: isAuthLoading, session } = useSupabaseSession();
  const userId = session?.user.id;
  const swrKey = token && userId && key ? [key, userId] : null;
  const swr = useSWR<z.infer<Schema>>(
    swrKey,
    ([url]: string[]) => swrFetcher(url, token!, schema),
    {
      revalidateOnFocus: false, // タブ復帰時に再取得しない
      shouldRetryOnError: false, // API通信失敗時に再試行しない
      keepPreviousData: false, // 前回データを一時的に残さない
    }
  );

  return {
    ...swr,
    isLoading: isAuthLoading || swr.isLoading,
  };
}
