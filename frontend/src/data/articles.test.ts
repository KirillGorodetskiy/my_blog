import { describe, expect, it } from 'vitest';
import { ARTICLE_CATEGORIES } from '@/data/types';
import { articles } from '@/test/fixtures/articles';
import { featuredItems } from '@/lib/filters';

describe('articles mock data', () => {
  it('provides six editorial pieces', () => {
    expect(articles).toHaveLength(6);
  });

  it('includes the required featured titles', () => {
    const titles = featuredItems(articles, 3).map(
      (article) => article.title,
    );

    expect(titles).toEqual([
      'How I Set Up a Personal RAG System on a VPS',
      'Lessons from Building AI Automations',
      'Finding Focus in a Distracted World',
    ]);
  });

  it('gives every article the fields the cards need', () => {
    for (const article of articles) {
      expect(article.slug).toMatch(/^[a-z0-9-]+$/);
      expect(article.title.length).toBeGreaterThan(8);
      expect(ARTICLE_CATEGORIES).toContain(article.category);
      expect(article.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(article.readTimeMinutes).toBeGreaterThan(0);
      expect(article.image).toMatch(/^\/images\/articles\//);
    }
  });
});
