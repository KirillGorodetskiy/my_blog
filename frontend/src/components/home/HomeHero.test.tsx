import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HomeHero } from '@/components/home/HomeHero';

vi.mock('@/components/transitions/TransitionContext', () => ({
  useRoomTransition: () => ({
    pathname: '/',
    previousPath: '/',
    difference: 0,
    compact: false,
    reduced: true,
    isClient: false,
    isTransitioning: false,
    markSettled: () => undefined,
  }),
}));

describe('HomeHero', () => {
  it('keeps view projects readable on the hero', () => {
    render(<HomeHero />);

    const link = screen.getByRole('link', {
      name: 'View projects',
    });

    expect(link).toHaveAttribute('href', '/projects');
    expect(link).toHaveClass('hero-secondary-cta');
  });

  it('hides compact CTAs when room edges appear', () => {
    render(<HomeHero />);

    const actions = screen
      .getByRole('link', { name: 'Explore articles' })
      .closest('.hero-room-actions');

    expect(actions).toHaveClass('hero-room-actions');
    expect(
      screen.getByRole('link', { name: 'View projects' })
        .closest('.hero-room-actions'),
    ).toBe(actions);
  });

  it('does not paint steam or laptop overlays', () => {
    render(<HomeHero />);

    expect(
      screen.queryByTestId('hero-steam'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('hero-laptop'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('hero-effects'),
    ).not.toBeInTheDocument();
  });

  it('keeps the full headline readable on compact screens', () => {
    const { container } = render(<HomeHero />);
    const section = container.querySelector('.home-hero');
    const title = screen.getByRole('heading', { level: 1 });

    expect(section).not.toBeNull();
    expect(title).toHaveClass('home-hero-title');
    expect(title).toHaveTextContent('A calmer way');
    expect(title).toHaveTextContent('to explore technology');
    expect(title.closest('.home-hero-copy')).not.toBeNull();
    expect(
      container.querySelector('.scene-hero-art-wrap'),
    ).not.toBeNull();
  });
});
