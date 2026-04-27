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

export const uiErrorSchema = z.object({
  code: errorCodeSchema,
  message: z.string(),
});
export type UiError = z.infer<typeof uiErrorSchema>;
