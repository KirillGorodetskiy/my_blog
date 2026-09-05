import { describe, expect, it } from 'vitest';
import {
  categoryToParam,
  featuredItems,
  filterByCategory,
  paramToCategory,
  usedCategories,
} from '@/lib/filters';

const items = [
  { title: 'A', category: 'AI', featured: true },
  { title: 'B', category: 'Life', featured: false },
  { title: 'C', category: 'AI', featured: true },
  { title: 'D', category: 'Travel', featured: true },
];

describe('filterByCategory', () => {
  it('returns every item for All', () => {
    expect(filterByCategory(items, 'All')).toEqual(items);
  });

  it('keeps only the selected category', () => {
    expect(filterByCategory(items, 'AI')).toEqual([
      items[0],
      items[2],
    ]);
  });

  it('returns an empty list when nothing matches', () => {
    expect(filterByCategory(items, 'Hardware')).toEqual([]);
  });
});

describe('featuredItems', () => {
  it('returns featured items up to the limit', () => {
    expect(featuredItems(items, 2)).toEqual([
      items[0],
      items[2],
    ]);
  });
});

describe('usedCategories', () => {
  it('keeps only categories that have content', () => {
    expect(
      usedCategories(items, ['AI', 'Life', 'Hardware']),
    ).toEqual(['AI', 'Life']);
  });

  it('derives sorted categories from content', () => {
    expect(usedCategories(items)).toEqual([
      'AI',
      'Life',
      'Travel',
    ]);
  });
});

describe('category query params', () => {
  it('serializes a category for the URL', () => {
    expect(categoryToParam('Web Apps')).toBe('web-apps');
  });

  it('reads a valid category from the URL', () => {
    expect(
      paramToCategory('web-apps', ['AI', 'Web Apps']),
    ).toBe('Web Apps');
  });

  it('falls back to All for an unknown tag', () => {
    expect(paramToCategory('missing', ['AI'])).toBe('All');
  });
});
