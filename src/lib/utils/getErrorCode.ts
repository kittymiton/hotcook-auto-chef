import {
  type ErrorCode,
  fetcherThrownErrorSchema,
} from '@/lib/schema/errorSchema';

export const getErrorCode = (e: unknown): ErrorCode => {
  // catchではeがunknownになるため、throw時のerrorCodeをZodで復元する
  const parsed = fetcherThrownErrorSchema.safeParse(e);

  const code = parsed.success ? parsed.data.errorCode : 'UNKNOWN_ERROR';

  return code;
};
