import z from 'zod';
// NOTE: エラーコードの並べ方
// ① 入力・認証
// ② リソース状態
// ③ 通信・外部
// ④ サーバー・その他
export const errorCodeSchema = z.enum([
  'INVALID_FORMAT',
  'UNAUTHORIZED',
  'FORBIDDEN',
  'TALK_NOT_FOUND',
  'RECIPE_NOT_FOUND',
  'NOT_FOUND',
  'QUOTA_EXCEEDED',
  'NETWORK_ERROR',
  'AI_ERROR',
  'INTERNAL_SERVER_ERROR',
  'DEFAULT',
  'UNKNOWN_ERROR',
]);
export type ErrorCode = z.infer<typeof errorCodeSchema>;

export const apiErrorResponseSchema = z.object({
  error: errorCodeSchema.optional(),
});
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;

export const fetcherThrownErrorSchema = z.object({
  errorCode: errorCodeSchema,
});
