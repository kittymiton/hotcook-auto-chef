import { getErrorCode } from '@/lib/utils/getErrorCode';
import { useAuthedSWR } from '@authenticated/hooks/useAuthedSWR';
import { ZodType } from 'zod';

export const useRecipes = <T>(url: string | null, schema: ZodType<T>) => {
  const { data, error, isLoading } = useAuthedSWR(url, schema);

  const errorCode = error ? getErrorCode(error) : null;

  return {
    data,
    error: errorCode,
    isLoading,
  };
};
