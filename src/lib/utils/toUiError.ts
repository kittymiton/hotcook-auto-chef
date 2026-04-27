import { toUiErrorText } from '@/lib/constants/toUiErrorText';
import {
  ErrorCode,
  errorCodeSchema,
  fetcherThrownErrorSchema,
  type UiError,
  uiErrorSchema,
} from '@/lib/schema/errorSchema';

export const toUiError = (e: unknown): UiError => {
  const throwParsed = fetcherThrownErrorSchema.safeParse(e);

  if (throwParsed.success) {
    const { errorCode } = throwParsed.data;
    const errorCodeParsed = errorCodeSchema.safeParse(errorCode);

    const code: ErrorCode = errorCodeParsed.success
      ? errorCodeParsed.data
      : 'UNKNOWN_ERROR';

    return uiErrorSchema.parse({
      code,
      message: toUiErrorText[code],
    });
  }

  if (e instanceof Error) {
    const parsed = errorCodeSchema.safeParse(e.message);
    const code: ErrorCode = parsed.success ? parsed.data : 'UNKNOWN_ERROR';

    return uiErrorSchema.parse({
      code,
      message: toUiErrorText[code],
    });
  }

  //fallback
  const code: ErrorCode = 'UNKNOWN_ERROR';

  return uiErrorSchema.parse({
    code,
    message: toUiErrorText[code],
  });
};
