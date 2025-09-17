import {
  CONTENT_TYPE_JSON,
  HEADER_AUTHORIZATION,
  HEADER_CONTENT_TYPE,
  HttpMethod,
} from '@/constants/index';

/**
 * 全API共通の通信Wrapper
 * APIエンドポイントにリクエストを送信、レスポンス(JSON)を返す関数
 * @param {string} url - 通信先URL
 * @param {Object} options - 通信オプション
 * @param {'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'} options.method - HTTPメソッド
 * @param {string} [options.token] - 認証トークン
 * @param {any} [options.body] - JSON形式のリクエストボディ
 * @returns {Promise<any>} - APIレスポンス
 **/
export const fetcher = async (
  url: string,
  {
    method,
    token,
    body,
  }: {
    method: HttpMethod;
    token?: string;
    body?: any;
  }
): Promise<any> => {
  const headers: Record<string, string> = {
    [HEADER_CONTENT_TYPE]: CONTENT_TYPE_JSON,
  };
  if (token) headers[HEADER_AUTHORIZATION] = token;

  const options: RequestInit = {
    method,
    headers,
    // body不要時にプロパティを完全に省略
    ...(body && { body: JSON.stringify(body) }),
  };

  const res = await fetch(url, options);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `HTTP ${res.status} ${res.statusText}`);
  }
  return await res.json();
};
