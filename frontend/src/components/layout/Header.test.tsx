import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider } from '@/components/auth/AuthContext';
import { Header } from '@/components/layout/Header';
import { SearchProvider } from '@/components/search/SearchContext';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Header', () => {
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
          isStaff: false,
        }),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the KIRILL lockup with the two-line slogan', () => {
    render(
      <AuthProvider>
        <SearchProvider>
          <Header />
        </SearchProvider>
      </AuthProvider>,
    );

    const home = screen.getByRole('link', { name: 'KIRILL' });

    expect(home).toHaveAttribute('href', '/');
    expect(home).toHaveClass('brand');
    expect(home.querySelector('.brand-name')).toHaveTextContent(
      'KIRILL',
    );
    expect(
      home.querySelector('.brand-divider'),
    ).toBeInTheDocument();
    expect(home.textContent).toContain('INSPIRED BY ME');
    expect(home.textContent).toContain('BUILT WITH AI');
    expect(home.textContent).not.toMatch(/INSPIRED BY ME[.,]/);
    expect(home.textContent).not.toMatch(/BUILT WITH AI[.,]/);
  });

  it('keeps full auth controls out of the mobile header', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          isAuthenticated: true,
          username: 'reader905',
          email: 'reader905@example.com',
          isSuperuser: false,
          isStaff: true,
        }),
      }),
    );

    render(
      <AuthProvider>
        <SearchProvider>
          <Header />
        </SearchProvider>
      </AuthProvider>,
    );

    expect(
      await screen.findByText('reader905'),
    ).toBeInTheDocument();
    expect(screen.getAllByText('reader905')).toHaveLength(1);
    expect(
      screen.queryByRole('dialog', { name: 'Menu' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Open menu' }),
    ).toBeInTheDocument();
  });

  it('keeps the full header behind the xl breakpoint', () => {
    render(
      <AuthProvider>
        <SearchProvider>
          <Header />
        </SearchProvider>
      </AuthProvider>,
    );

    expect(screen.getByRole('navigation', { name: 'Primary' }))
      .toHaveClass('xl:flex');
    expect(
      screen.getByRole('button', { name: 'Open menu' }),
    ).toHaveClass('xl:hidden');
  });
});
