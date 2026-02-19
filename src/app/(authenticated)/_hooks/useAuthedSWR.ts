import { swrFetcher } from '@/lib/apiClient/swrFetcher';
import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import useSWR from 'swr';
import z from 'zod';

export function useAuthedSWR<S extends z.ZodTypeAny>(
  key: string | null,
  schema: S
) {
  const { token, isLoading: isAuthLoading } = useSupabaseSession();
  const swrKey = token && key ? key : null;

  const swr = useSWR<z.infer<S>>(
    swrKey,
    (url: string) => swrFetcher(url, token!, schema),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      keepPreviousData: true,
    }
  );

  return {
    ...swr,
    isLoading: isAuthLoading || swr.isLoading || (!swr.data && !swr.error),
  };
}
