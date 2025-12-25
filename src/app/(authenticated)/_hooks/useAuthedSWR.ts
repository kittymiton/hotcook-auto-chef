import { fetchData } from '@/lib/apiClient/fetchData';
import { useSupabaseSession } from '@auth/hooks/useSupabaseSession';
import useSWR from 'swr';

/**
 * 認証付きでSWRによるデータ取得を行う共通Hook
 * - 内部でuseSupabaseSessioを呼び出し、tokenを自動的に取得
 * - tokenが確定するまでは、フェッチを行わない（null待機）
 * - ローディング状態（isLoading）を認証・通信の両面から統合的に管理
 * @param key - SWRのキー（APIのURL。nullの場合は待機状態となる）
 * @template T - 取得するデータの型定義
 */
export function useAuthedSWR<T>(key: string | null) {
  const { token, isLoading: isAuthLoading } = useSupabaseSession();
  const swrKey = token && key ? key : null;

  const swr = useSWR<T>(swrKey, (url: string) => fetchData<T>(url, token!), {
    revalidateOnFocus: false, //タブ復帰時に再取得
    shouldRetryOnError: false, //エラー時に再試行
    keepPreviousData: true, //前回データを一時的に残す
  });

  return {
    ...swr,
    isLoading: isAuthLoading || swr.isLoading || (!swr.data && !swr.error),
  };
}
