import { HttpMethod } from '@/constants/index';

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

  const res = await fetch(url, options);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${res.status} ${res.statusText}`);
  }
  return await res.json();
}
