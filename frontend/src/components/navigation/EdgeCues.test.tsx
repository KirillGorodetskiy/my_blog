import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EdgeCues } from '@/components/navigation/EdgeCues';

vi.mock('next/navigation', () => ({
  usePathname: () => mockPath,
}));

let mockPath = '/';

describe('EdgeCues', () => {
  it('links home to both wings', () => {
    mockPath = '/';
    render(<EdgeCues />);

    expect(
      screen.getByRole('link', { name: '← Library' }),
    ).toHaveAttribute('href', '/articles');
    expect(
      screen.getByRole('link', { name: 'Workshop →' }),
    ).toHaveAttribute('href', '/projects');
  });

  it('sends the library back to the shelter', () => {
    mockPath = '/articles';
    render(<EdgeCues />);

    expect(
      screen.getByRole('link', { name: 'Shelter →' }),
    ).toHaveAttribute('href', '/');
    expect(
      screen.queryByRole('link', { name: '← Library' }),
    ).not.toBeInTheDocument();
  });

  it('sends the workshop back to the shelter', () => {
    mockPath = '/projects/blog-website-rebuild';
    render(<EdgeCues />);

    expect(
      screen.getByRole('link', { name: '← Shelter' }),
    ).toHaveAttribute('href', '/');
  });
});
