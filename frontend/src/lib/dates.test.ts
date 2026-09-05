import { describe, expect, it } from 'vitest';
import { formatDate } from '@/lib/dates';

describe('formatDate', () => {
  it('formats ISO dates without locale drift', () => {
    expect(formatDate('2026-08-12')).toBe('12 Aug 2026');
    expect(formatDate('2026-07-03')).toBe('3 Jul 2026');
  });
});
