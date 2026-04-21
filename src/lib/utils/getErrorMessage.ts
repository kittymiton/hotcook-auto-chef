import { errorText } from '@/lib/constants/errorText';

export const getErrorMessage = (e: unknown): string => {
  if (e instanceof Error) {
    return errorText[e.message] ?? errorText.DEFAULT;
  }
  return errorText.DEFAULT;
};
