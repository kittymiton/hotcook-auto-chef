import { HttpMethod } from '@/constants/index';
import { errorResponseSchema } from '@/lib/schema/errorResponseSchema';

export async function fetcher(
  url: string,
  {
    method,
    token,
    body,
  }: {
    method: HttpMethod;
    token?: string;
    body?: unknown;
  }
): Promise<unknown> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  };

  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      const raw = await res.json().catch(() => ({}));
      const parsed = errorResponseSchema.safeParse(raw);

      const errorCode =
        parsed.success && parsed.data.error
          ? parsed.data.error
          : 'UNKNOWN_ERROR';

      console.error('[Fetcher]', {
        status: res.status,
        statusText: res.statusText,
        errorCode,
      });
      throw new Error(errorCode);
    }
    return await res.json();
  } catch (err) {
    if (err instanceof Error && err.message === 'Failed to fetch') {
      throw new Error('NETWORK_ERROR');
    }
    throw err;
  }
}
