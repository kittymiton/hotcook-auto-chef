import { chatSchema } from '@/lib/schema/chatSchema';
import { getErrorCode } from '@/lib/utils/getErrorCode';
import { useAuthedSWR } from '@authenticated/hooks/useAuthedSWR';

export const useTalks = (url: string | null) => {
  const { data, error, isLoading } = useAuthedSWR(url, chatSchema);

  const errorCode = error ? getErrorCode(error) : null;
  return {
    data,
    error: errorCode,
    isLoading,
  };
};
