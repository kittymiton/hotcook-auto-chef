import { errorCodeMap } from '@/lib/constants/errorCodeMap';
import { fetcherThrownErrorSchema } from '@/lib/schema/errorSchema';

export const getErrorMessage = (e: unknown): string => {
  // catchではeがunknownになるため、throw時のerrorCodeをZodで復元する
  const parsed = fetcherThrownErrorSchema.safeParse(e);

  const code = parsed.success ? parsed.data.errorCode : 'UNKNOWN_ERROR';

  return errorCodeMap[code];
};
