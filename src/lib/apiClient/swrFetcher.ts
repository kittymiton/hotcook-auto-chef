import { fetcher } from '@/lib/apiClient/fetcher';
import z from 'zod';

export async function swrFetcher<S extends z.ZodTypeAny>(
  url: string,
  token: string,
  schema: S
): Promise<z.infer<S>> {
  const res = await fetcher(url, {
    method: 'GET',
    token,
  });
  return schema.parse(res);
}
