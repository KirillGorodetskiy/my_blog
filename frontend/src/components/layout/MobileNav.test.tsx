import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/components/auth/AuthContext';
import { MobileNav } from '@/components/layout/MobileNav';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/articles', label: 'Articles' },
];

describe('MobileNav', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          isAuthenticated: false,
          username: null,
          email: null,
          isSuperuser: false,
        }),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });
  it('does not render when closed', () => {
    render(
      <AuthProvider>
        <MobileNav
          open={false}
          links={LINKS}
          pathname='/'
          onClose={() => undefined}
        />
      </AuthProvider>,
    );

    expect(
      screen.queryByRole('dialog', { name: 'Menu' }),
    ).not.toBeInTheDocument();
  });

  it('opens as a left panel on the document body', () => {
    const { container } = render(
      <AuthProvider>
        <header>
          <MobileNav
            open
            links={LINKS}
            pathname='/'
            onClose={() => undefined}
          />
        </header>
      </AuthProvider>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Menu' });

    expect(dialog).toHaveClass('mobile-nav');
    expect(dialog.querySelector('.mobile-nav-panel')).toBeTruthy();
    expect(container.querySelector('.mobile-nav')).toBeNull();
    expect(
      screen.getByRole('link', { name: 'Home' }),
    ).toHaveAttribute('href', '/');
  });

  it('closes from the dismiss control', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <AuthProvider>
        <MobileNav
          open
          links={LINKS}
          pathname='/'
          onClose={onClose}
        />
      </AuthProvider>,
    );

    await user.click(
      screen.getByRole('button', { name: 'Close menu' }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
