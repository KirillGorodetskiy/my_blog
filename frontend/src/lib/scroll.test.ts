import { describe, expect, it, vi } from 'vitest';
import { resetWindowScroll } from '@/lib/scroll';

describe('resetWindowScroll', () => {
  it('moves the window to the top of the page', () => {
    const scrollTo = vi.fn();
    vi.stubGlobal('scrollTo', scrollTo);

    resetWindowScroll();

    expect(scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  });
});
