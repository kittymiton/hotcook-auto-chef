import { chatSchema } from '@/lib/schema/chatSchema';
import { toUiError } from '@/lib/utils/toUiError';
import { useAuthedSWR } from '@authenticated/hooks/useAuthedSWR';

export const useTalks = (url: string | null) => {
  const { data, error, isLoading } = useAuthedSWR(url, chatSchema);

  const uiError = error ? toUiError(error) : null;

  return {
    data,
    error: uiError,
    isLoading,
  };
};
