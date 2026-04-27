import { HttpMethod } from '@/constants/index';
import { apiErrorResponseSchema } from '@/lib/schema/errorSchema';

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
    headers['Authorization'] = `Bearer ${token}`; // クライアント側で生成されたtokenのためそのまま使用
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
      const parsed = apiErrorResponseSchema.safeParse(raw);

      const errorCode =
        parsed.success && parsed.data.error
          ? parsed.data.error
          : 'UNKNOWN_ERROR';

      console.error('[Fetcher]', {
        status: res.status,
        statusText: res.statusText,
        errorCode,
      });
      throw {
        errorCode,
      };
    }
    return await res.json();
  } catch (e) {
    if (e instanceof Error && e.message === 'Failed to fetch') {
      throw new Error('NETWORK_ERROR');
    }
    throw e;
  }
}
