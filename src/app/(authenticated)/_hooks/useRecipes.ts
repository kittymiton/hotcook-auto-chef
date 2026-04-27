import { toUiError } from '@/lib/utils/toUiError';
import { useAuthedSWR } from '@authenticated/hooks/useAuthedSWR';
import { ZodType } from 'zod';

export const useRecipes = <T>(url: string | null, schema: ZodType<T>) => {
  const { data, error, isLoading } = useAuthedSWR(url, schema);

  const uiError = error ? toUiError(error) : null;

  return {
    data,
    errorMsg: uiError?.message ?? null,
    isLoading,
  };
};
