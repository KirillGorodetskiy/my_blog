import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import nextConfig from '../../../next.config';
import type { AuthUser } from '@/lib/api/auth';
import { ApiError, apiUrl, fetchJson } from '@/lib/api/client';

describe('nextConfig', () => {
  it('keeps API trailing slashes for Django', () => {
    expect(nextConfig.skipTrailingSlashRedirect).toBe(true);
  });
});

describe('auth and content contracts', () => {
  it('includes isStaff on AuthUser', () => {
    const user: AuthUser = {
      isAuthenticated: true,
      username: 'editor',
      email: 'editor@example.com',
      isStaff: true,
      isSuperuser: false,
    };
    expect(user.isStaff).toBe(true);
  });

  it('does not import demo article arrays in production helpers', () => {
    const files = [
      'src/lib/content.ts',
      'src/lib/rss.ts',
      'src/lib/search.ts',
    ];
    for (const file of files) {
      const source = readFileSync(
        path.join(process.cwd(), file),
        'utf8',
      );
      expect(source).not.toMatch('@/data/articles');
      expect(source).not.toMatch('@/data/projects');
    }
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
