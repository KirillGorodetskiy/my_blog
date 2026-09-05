import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StaffEditLink } from '@/components/content/StaffEditLink';
import type { AuthUser } from '@/lib/api/auth';

const authState = vi.hoisted(() => ({
  user: {
    isAuthenticated: true,
    username: 'reader905',
    email: 'reader905@example.com',
    isStaff: false,
    isSuperuser: false,
  } as AuthUser,
}));

const fetchJson = vi.hoisted(() => vi.fn());

vi.mock('@/components/auth/AuthContext', () => ({
  useAuth: () => ({
    user: authState.user,
    ready: true,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock('@/lib/api/client', () => ({
  fetchJson,
}));

describe('StaffEditLink', () => {
  beforeEach(() => {
    fetchJson.mockReset();
    authState.user = {
      isAuthenticated: true,
      username: 'reader905',
      email: 'reader905@example.com',
      isStaff: false,
      isSuperuser: false,
    };
  });

  it('hides the edit action from a normal user', () => {
    render(
      <StaffEditLink
        kind='article'
        slug='welcome'
        label='Edit article'
      />,
    );
    expect(
      screen.queryByRole('link', { name: 'Edit article' }),
    ).not.toBeInTheDocument();
    expect(fetchJson).not.toHaveBeenCalled();
  });

  it('shows a staff edit link from the API url', async () => {
    authState.user = {
      ...authState.user,
      username: 'editor',
      isStaff: true,
    };
    fetchJson.mockResolvedValue({
      adminUrl: '/admin/blog/post/3/change/',
    });
    render(
      <StaffEditLink
        kind='article'
        slug='welcome'
        label='Edit article'
      />,
    );
    const link = await screen.findByRole('link', {
      name: 'Edit article',
    });
    expect(link).toHaveAttribute(
      'href',
      '/admin/blog/post/3/change/',
    );
    await waitFor(() => {
      expect(fetchJson).toHaveBeenCalledWith(
        '/api/v1/articles/welcome/',
      );
    });
  });
});
