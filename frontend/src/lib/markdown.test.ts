import { describe, expect, it } from 'vitest';
import {
  extractHeadings,
  extractProjectOverview,
  isSafeHref,
  isSafeMarkdownImage,
  projectCardSummary,
} from '@/lib/markdown';

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

describe('extractProjectOverview', () => {
  it('returns the first paragraph under Overview', () => {
    const source = [
      '## Overview',
      '',
      'A Django blog built as a learning project.',
      '',
      '## Key Features',
      '',
      '- Post management',
      '- Authentication',
    ].join('\n');

    expect(extractProjectOverview(source)).toBe(
      'A Django blog built as a learning project.',
    );
  });

  it('falls back to the first paragraph', () => {
    expect(
      extractProjectOverview('A Snake game from a Python course.'),
    ).toBe('A Snake game from a Python course.');
  });
});

describe('isSafeMarkdownImage', () => {
  it('allows local media and https images', () => {
    expect(isSafeMarkdownImage('/media/posts/diagram.png')).toBe(
      true,
    );
    expect(
      isSafeMarkdownImage('https://gkablog.com/media/a.png'),
    ).toBe(true);
  });

  it('allows other https hosts as a plain-image fallback', () => {
    expect(
      isSafeMarkdownImage('https://images.example/shot.png'),
    ).toBe(true);
  });

  it('rejects unsafe schemes', () => {
    expect(isSafeMarkdownImage('javascript:alert(1)')).toBe(false);
    expect(isSafeMarkdownImage('data:image/png;base64,xx')).toBe(
      false,
    );
  });
});

describe('projectCardSummary', () => {
  it('matches the compact overview helper', () => {
    expect(projectCardSummary('A short summary.')).toBe(
      extractProjectOverview('A short summary.'),
    );
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
