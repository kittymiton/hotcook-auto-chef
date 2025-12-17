import { fetchData } from '@/lib/apiClient/fetchData';
import useSWR from 'swr';

/**
 * 認証付きでSWRによるデータ取得を行う共通Hook
 *
 * - tokenが存在しない場合はフェッチを行わない
 * - SWRの共通オプション（revalidate等）を内部で固定
 * - ジェネリックTにより、取得データの型安全を保証する
 * @param key SWRのキー（通常はAPIのURL、nullの場合はフェッチしない）
 * @param token 認証トークン
 */
export function useAuthedSWR<T>(key: string | null, token: string | null) {
  return useSWR<T>(
    token ? key : null,
    (url: string) => fetchData<T>(url, token!),
    {
      revalidateOnFocus: false, //タブ復帰時に再取得
      shouldRetryOnError: false, //エラー時に再試行
      keepPreviousData: true, //前回データを一時的に残す
    }
  );
}
