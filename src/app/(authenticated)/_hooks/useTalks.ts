import { chatSchema } from '@/lib/schema/chatSchema';
import { getErrorMessage } from '@/lib/utils/getErrorMessage';
import { useAuthedSWR } from '@authenticated/hooks/useAuthedSWR';

export const useTalks = (url: string | null) => {
  const { data, error, isLoading } = useAuthedSWR(url, chatSchema);

  const errorCode =
    error && typeof error === 'object' && 'errorCode' in error
      ? String(error.errorCode)
      : null;

  const errorMsg = error ? getErrorMessage(error) : null;

  return {
    data,
    errorCode,
    errorMsg,
    isLoading,
  };
};
