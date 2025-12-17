import { swrFetcher } from '@/lib/apiClient/swrFetcher';

/**
 * SWR用のデータ取得ラッパー関数
 *
 * - Authorizationヘッダーにアクセストークンを付与し、認証付きAPIリクエストを行うための共通処理をまとめた関数
 * - 実際のHTTP通信はswrFetcherに委譲
 * - Generics<T>によって、呼び出し側でレスポンスの型安全を担保
 * @param url - リクエスト先のAPI URL（SWRのfetcherから渡される）
 * @param token - Authorizationヘッダーに使用するアクセストークン
 * @returns APIレスポンス(JSON) を型Tとして返すPromise
 */
export async function fetchData<T>(url: string, token: string): Promise<T> {
  return swrFetcher<T>(url, token);
}
