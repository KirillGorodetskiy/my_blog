import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AboutHero } from '@/components/about/AboutHero';
import { ArticlesHero } from '@/components/articles/ArticlesHero';
import { ProjectsHero } from '@/components/projects/ProjectsHero';

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

describe('room heroes', () => {
  it.each([
    ['Articles', ArticlesHero],
    ['Projects', ProjectsHero],
    ['About', AboutHero],
  ])(
    'keeps the %s title out of the short art crop',
    (_name, Hero) => {
      const { container } = render(<Hero />);

      expect(
        container.querySelector('.scene-hero'),
      ).not.toBeNull();
      expect(
        container.querySelector('.scene-hero-art-wrap'),
      ).not.toBeNull();
      const title = screen.getByRole('heading', { level: 1 });

      expect(title.closest('.scene-hero-copy')).not.toBeNull();
      expect(title).toHaveClass('scene-hero-title');
    },
  );
});
