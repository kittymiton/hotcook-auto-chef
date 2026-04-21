import { chatSchema } from '@/lib/schema/chatSchema';
import { getErrorMessage } from '@/lib/utils/getErrorMessage';
import { useAuthedSWR } from '@authenticated/hooks/useAuthedSWR';

export const useTalks = (url: string | null) => {
  const { data, error, isLoading } = useAuthedSWR(url, chatSchema);

  const errorMsg = error ? getErrorMessage(error) : null;

  return {
    data,
    errorMsg,
    isLoading,
  };
};
