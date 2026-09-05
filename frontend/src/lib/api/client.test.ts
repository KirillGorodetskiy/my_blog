import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import nextConfig from '../../../next.config';
import type { AuthUser } from '@/lib/api/auth';
import {
  ApiError,
  apiUrl,
  ensureCsrfToken,
  fetchJson,
} from '@/lib/api/client';

describe('nextConfig', () => {
  it('keeps API trailing slashes for Django', () => {
    expect(nextConfig.skipTrailingSlashRedirect).toBe(true);
  });

  it('forwards Django admin paths with a trailing slash', async () => {
    const rules = await nextConfig.rewrites();
    const list = Array.isArray(rules) ? rules : [];
    const adminRules = list.filter((rule) =>
      rule.source.startsWith('/admin'),
    );
    expect(adminRules.length).toBeGreaterThan(0);
    for (const rule of adminRules) {
      expect(rule.destination.endsWith('/')).toBe(true);
    }
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

describe('ensureCsrfToken', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.cookie = 'csrftoken=; max-age=0; path=/';
  });

  it('returns the existing cookie without fetching', async () => {
    document.cookie = 'csrftoken=already';
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(ensureCsrfToken()).resolves.toBe('already');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('bootstraps /auth/me/ when the cookie is missing', async () => {
    const fetchMock = vi.fn().mockImplementation(async () => {
      document.cookie = 'csrftoken=from-me';
      return {
        ok: true,
        status: 200,
        json: async () => ({
          isAuthenticated: false,
          username: null,
          email: null,
          isStaff: false,
          isSuperuser: false,
        }),
      };
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(ensureCsrfToken()).resolves.toBe('from-me');
    expect(String(fetchMock.mock.calls[0][0])).toContain(
      '/api/v1/auth/me/',
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
