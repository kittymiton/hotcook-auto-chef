export const HEADER_CONTENT_TYPE = 'Content-Type';
export const CONTENT_TYPE_JSON = 'application/json';
export const HEADER_AUTHORIZATION = 'Authorization';
export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const; // as constでリテラル（固定値）化↓
export type HttpMethod = (typeof HTTP_METHODS)[number]; //typeof 配列[number]で各要素を列挙型（ユニオン型）で取り出す
