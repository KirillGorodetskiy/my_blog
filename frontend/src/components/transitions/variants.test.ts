import { describe, expect, it } from 'vitest';
import { pageVariants } from '@/components/transitions/variants';

type EnterExit = (options: {
  difference: number;
  compact: boolean;
  reduced: boolean;
}) => { x: number; opacity: number };

describe('pageVariants', () => {
  it('brings articles in from the left', () => {
    const enter = pageVariants.enter as EnterExit;
    const exit = pageVariants.exit as EnterExit;
    const options = {
      difference: -1,
      compact: false,
      reduced: false,
    };

    expect(enter(options).x).toBeLessThan(0);
    expect(exit(options).x).toBeGreaterThan(0);
  });

  it('fades without a slide on first load or about', () => {
    const enter = pageVariants.enter as EnterExit;
    const options = {
      difference: 0,
      compact: false,
      reduced: false,
    };

    expect(enter(options).x).toBe(0);
    expect(enter(options).opacity).toBe(0);
  });

  it('brings projects in from the right', () => {
    const enter = pageVariants.enter as EnterExit;
    const exit = pageVariants.exit as EnterExit;
    const options = {
      difference: 1,
      compact: false,
      reduced: false,
    };

    expect(enter(options).x).toBeGreaterThan(0);
    expect(exit(options).x).toBeLessThan(0);
  });
});
