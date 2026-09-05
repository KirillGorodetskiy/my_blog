import { describe, expect, it } from 'vitest';
import { pageVariants } from '@/components/transitions/variants';

type EnterExit = (options: {
  difference: number;
  compact: boolean;
  reduced: boolean;
}) => { x: number; opacity: number; y?: number };

describe('pageVariants', () => {
  it('fades the incoming page without a slide', () => {
    const enter = pageVariants.enter as EnterExit;
    const options = {
      difference: -1,
      compact: false,
      reduced: false,
    };

    expect(enter(options).x).toBe(0);
    expect(enter(options).opacity).toBe(0);
    expect(enter(options).y).toBe(8);
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

  it('keeps the exit variant in document flow', () => {
    const exit = pageVariants.exit as { position?: string };

    expect(exit.position).toBeUndefined();
  });
});
