import { describe, expect, it } from 'vitest';
import { extractHeadings, isSafeHref } from '@/lib/markdown';

const SAMPLE = [
  '## Setup',
  '',
  'A quiet first paragraph.',
  '',
  '### Notes',
  '',
  '## Docker architecture',
].join('\n');

describe('extractHeadings', () => {
  it('returns deterministic h2 and h3 ids', () => {
    expect(extractHeadings(SAMPLE)).toEqual([
      { id: 'setup', text: 'Setup', level: 2 },
      { id: 'notes', text: 'Notes', level: 3 },
      {
        id: 'docker-architecture',
        text: 'Docker architecture',
        level: 2,
      },
    ]);
  });

  it('strips decorative markers from TOC labels', () => {
    expect(extractHeadings('## ✅ Reliable delivery')).toEqual([
      {
        id: 'reliable-delivery',
        text: 'Reliable delivery',
        level: 2,
      },
    ]);
  });
});

describe('isSafeHref', () => {
  it('allows http, site, hash, and mailto links', () => {
    expect(isSafeHref('https://example.com')).toBe(true);
    expect(isSafeHref('/media/shot.webp')).toBe(true);
    expect(isSafeHref('#setup')).toBe(true);
    expect(isSafeHref('mailto:hi@example.com')).toBe(true);
  });

  it('rejects javascript URLs', () => {
    expect(isSafeHref('javascript:alert(1)')).toBe(false);
  });
});
