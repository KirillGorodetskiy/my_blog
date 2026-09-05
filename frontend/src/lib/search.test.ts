import { describe, expect, it } from 'vitest';
import { articles } from '@/test/fixtures/articles';
import { projects } from '@/test/fixtures/projects';
import {
  buildSearchItems,
  moveSearchIndex,
  searchItems,
} from '@/lib/search';

describe('searchItems', () => {
  const items = buildSearchItems(articles, projects);

  it('includes articles, projects, and navigation', () => {
    const types = new Set(items.map((item) => item.group));

    expect(types.has('Articles')).toBe(true);
    expect(types.has('Projects')).toBe(true);
    expect(types.has('Navigation')).toBe(true);
  });

  it('matches article titles and tags', () => {
    const results = searchItems(items, 'rag');

    expect(results.some(
      (item) => item.href === '/articles/personal-rag-vps',
    )).toBe(true);
  });

  it('matches project summaries and technologies', () => {
    const results = searchItems(items, 'crm');

    expect(results.some(
      (item) => item.href === '/projects/ai-lead-qualification',
    )).toBe(true);
  });

  it('keeps navigation when the query is empty', () => {
    const results = searchItems(items, '');

    expect(results.filter(
      (item) => item.group === 'Navigation',
    ).map((item) => item.title)).toEqual([
      'Home',
      'Articles',
      'Projects',
      'About',
    ]);
  });
});

describe('moveSearchIndex', () => {
  it('wraps from the last result to the first', () => {
    expect(moveSearchIndex(2, 1, 3)).toBe(0);
  });

  it('wraps from the first result to the last', () => {
    expect(moveSearchIndex(0, -1, 3)).toBe(2);
  });

  it('returns zero when there are no results', () => {
    expect(moveSearchIndex(0, 1, 0)).toBe(0);
  });
});
