import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthControls } from '@/components/auth/AuthControls';
import type { AuthUser } from '@/lib/api/auth';

const authState = vi.hoisted(() => ({
  user: {
    isAuthenticated: false,
    username: null,
    email: null,
    isStaff: false,
    isSuperuser: false,
  } as AuthUser,
}));

vi.mock('@/components/auth/AuthContext', () => ({
  useAuth: () => ({
    user: authState.user,
    ready: true,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }),
}));

describe('AuthControls', () => {
  beforeEach(() => {
    authState.user = {
      isAuthenticated: true,
      username: 'reader905',
      email: 'reader905@example.com',
      isStaff: false,
      isSuperuser: false,
    };
  });

  it('hides Admin for a normal authenticated user', () => {
    render(<AuthControls />);
    expect(screen.getByText('reader905')).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Admin' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Logout' }),
    ).toBeInTheDocument();
  });

  it('shows Admin for a staff user', () => {
    authState.user = {
      ...authState.user,
      username: 'editor',
      isStaff: true,
    };
    render(<AuthControls />);
    const admin = screen.getByRole('link', { name: 'Admin' });
    expect(admin).toHaveAttribute('href', '/admin/');
  });
});
