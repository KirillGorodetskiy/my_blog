import { describe, expect, it } from 'vitest';
import { getRoomVariants } from '@/lib/motion';

describe('getRoomVariants', () => {
  it('uses only opacity when motion is reduced', () => {
    const variants = getRoomVariants(-1, true, false);

    expect(variants.enter).toEqual({ opacity: 0 });
    expect(variants.center).toEqual({ opacity: 1 });
    expect(variants.exit).toEqual({ opacity: 0 });
  });

  it('enters from the left when moving toward the library', () => {
    const variants = getRoomVariants(-1, false, false);
    const enter = variants.enter as { x: number };

    expect(enter.x).toBeLessThan(0);
  });

  it('enters from the right when moving toward the workshop', () => {
    const variants = getRoomVariants(1, false, false);
    const enter = variants.enter as { x: number };

    expect(enter.x).toBeGreaterThan(0);
  });

  it('uses a smaller offset on compact viewports', () => {
    const desktop = getRoomVariants(1, false, false);
    const mobile = getRoomVariants(1, false, true);
    const desktopEnter = desktop.enter as { x: number };
    const mobileEnter = mobile.enter as { x: number };

    expect(Math.abs(mobileEnter.x)).toBeLessThan(
      Math.abs(desktopEnter.x),
    );
  });
});
