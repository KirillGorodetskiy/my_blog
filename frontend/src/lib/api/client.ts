function messageFromPayload(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    return '';
  }

  const data = payload as Record<string, unknown>;

  if (typeof data.detail === 'string') {
    return data.detail;
  }

  for (const value of Object.values(data)) {
    if (typeof value === 'string') {
      return value;
    }

    if (Array.isArray(value) && typeof value[0] === 'string') {
      return value[0];
    }
  }

  return '';
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function internalOrigin(): string {
  return (
    process.env.INTERNAL_API_URL ?? 'http://127.0.0.1:8000'
  ).replace(/\/$/, '');
}

export function apiUrl(path: string): string {
  const suffix = path.startsWith('/') ? path : `/${path}`;

  if (typeof window === 'undefined') {
    return `${internalOrigin()}${suffix}`;
  }

  return suffix;
}

export function readCsrfToken(): string {
  if (typeof document === 'undefined') {
    return '';
  }

  const match = document.cookie.match(
    /(?:^|; )csrftoken=([^;]+)/,
  );

  return match ? decodeURIComponent(match[1]) : '';
}

export async function ensureCsrfToken(): Promise<string> {
  const existing = readCsrfToken();

  if (existing) {
    return existing;
  }

  await fetchJson('/api/v1/auth/me/');
  return readCsrfToken();
}

interface FetchJsonOptions extends RequestInit {
  parse?: boolean;
}

export async function fetchJson<T>(
  path: string,
  init: FetchJsonOptions = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  const isFormless = init.body !== undefined;

  if (isFormless && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (typeof window !== 'undefined') {
    const csrf = readCsrfToken();

    if (csrf && !headers.has('X-CSRFToken')) {
      headers.set('X-CSRFToken', csrf);
    }
  }

  const response = await fetch(apiUrl(path), {
    ...init,
    headers,
    credentials:
      init.credentials ??
      (typeof window === 'undefined' ? 'omit' : 'include'),
    cache: init.cache ?? 'no-store',
  });

  if (init.signal?.aborted) {
    throw new DOMException(
      'The operation was aborted.',
      'AbortError',
    );
  }

  if (!response.ok) {
    let detail = response.statusText;

    try {
      const payload = await response.json();
      detail = messageFromPayload(payload) || detail;
    } catch {
      detail = response.statusText;
    }

    throw new ApiError(response.status, detail);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
