import { afterEach, describe, expect, it, vi } from 'vitest';
import nextConfig from '../../../next.config';
import { ApiError, apiUrl, fetchJson } from '@/lib/api/client';

describe('nextConfig', () => {
  it('keeps API trailing slashes for Django', () => {
    expect(nextConfig.skipTrailingSlashRedirect).toBe(true);
  });
});

describe('apiUrl', () => {
  it('uses the internal origin on the server', () => {
    expect(apiUrl('/api/v1/articles/')).toContain(
      '/api/v1/articles/',
    );
  });
});

describe('fetchJson', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns JSON for a successful response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [{ slug: 'note' }],
      }),
    );

    await expect(
      fetchJson('/api/v1/articles/'),
    ).resolves.toEqual([{ slug: 'note' }]);
  });

  it('raises ApiError for a failed response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ detail: 'Not found.' }),
      }),
    );

    await expect(
      fetchJson('/api/v1/articles/missing/'),
    ).rejects.toMatchObject({
      status: 404,
      message: 'Not found.',
    } satisfies Partial<ApiError>);
  });
});
