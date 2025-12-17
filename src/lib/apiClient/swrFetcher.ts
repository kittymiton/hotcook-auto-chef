/**
 * SWRのGET専用フェッチ関数（POSTはAPIRoute内で直接処理）
 * - talked[]/recipes[]/配列/単体オブジェクトなどGETレスポンスの形式に合わせて返すAPIレスポンス正規化
 * @param url ・・APIのエンドポイントURL
 * @param token string | undefined ・・認証トークン
 * @returns Promise<T>data ・・SWRがPromiseを待ってdataに格納
 **/
export async function swrFetcher<T>(
  url: string | null,
  token?: string
): Promise<T> {
  if (!token) throw new Error('トークンがありません');
  if (!url) throw new Error('URLがありません');

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  let json: any;
  try {
    json = await res.json();
  } catch {
    throw new Error('レスポンスの形式が不正です');
  }

  if (!res.ok) {
    throw new Error(`[${url}]${json?.error || `HTTP ${res.status}`}`);
  }

  // ---- talk オブジェクト対応 ----
  if (json.talked && Array.isArray(json.talked)) {
    return json.talked as T;
  }

  // ---- recipes オブジェクト対応 ----
  if (json.recipes && Array.isArray(json.recipes)) {
    return json.recipes as T;
  }

  // ---- 生配列対応 ----
  if (Array.isArray(json)) return json as T;

  // ---- recipe 単体 ----
  if (json.recipe) return json.recipe as T;

  throw new Error('レスポンスの形式が不正です');
}
