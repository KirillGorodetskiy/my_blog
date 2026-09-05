import { afterEach, describe, expect, it, vi } from 'vitest';
import { loginUser, registerUser } from '@/lib/api/auth';

const anonymous = {
  isAuthenticated: false,
  username: null,
  email: null,
  isStaff: false,
  isSuperuser: false,
};

describe('auth CSRF bootstrap', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.cookie = 'csrftoken=; max-age=0; path=/';
  });

  it('fetches /auth/me/ before login when no cookie exists', async () => {
    const fetchMock = vi.fn().mockImplementation(async (url) => {
      if (String(url).includes('/auth/me/')) {
        document.cookie = 'csrftoken=bootstrapped';
        return {
          ok: true,
          status: 200,
          json: async () => anonymous,
        };
      }

      return {
        ok: true,
        status: 200,
        json: async () => ({
          ...anonymous,
          isAuthenticated: true,
          username: 'reader',
        }),
      };
    });
    vi.stubGlobal('fetch', fetchMock);

    await loginUser({
      username: 'reader',
      password: 'SafePass123!',
    });

    expect(String(fetchMock.mock.calls[0][0])).toContain(
      '/api/v1/auth/me/',
    );
    expect(String(fetchMock.mock.calls[1][0])).toContain(
      '/api/v1/auth/login/',
    );
    expect(fetchMock.mock.calls[1][1]?.headers.get('X-CSRFToken')).toBe(
      'bootstrapped',
    );
  });

  it('skips bootstrap when a CSRF cookie already exists', async () => {
    document.cookie = 'csrftoken=present';
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        ...anonymous,
        isAuthenticated: true,
        username: 'reader',
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await registerUser({
      username: 'reader',
      email: 'reader@example.com',
      password: 'SafePass123!',
      passwordConfirm: 'SafePass123!',
      turnstileToken: 'fresh',
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toContain(
      '/api/v1/auth/register/',
    );
  });
});
