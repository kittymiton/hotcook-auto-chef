import { getErrorMessage } from '@/lib/utils/getErrorMessage';
import { useAuthedSWR } from '@authenticated/hooks/useAuthedSWR';
import { ZodType } from 'zod';

export const useRecipes = <T>(url: string | null, schema: ZodType<T>) => {
  const { data, error, isLoading } = useAuthedSWR(url, schema);

  const uiError = error ? getErrorMessage(error) : null;

  return {
    data,
    error: uiError,
    isLoading,
  };
};
