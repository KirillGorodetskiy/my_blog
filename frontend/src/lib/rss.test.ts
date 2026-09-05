import { describe, expect, it } from 'vitest';
import { buildArticlesRss } from '@/lib/rss';
import { articles } from '@/test/fixtures/articles';

describe('buildArticlesRss', () => {
  it('includes title, link, date, and excerpt for each article', () => {
    const xml = buildArticlesRss(
      'https://gkablog.com',
      articles,
    );

    expect(xml.startsWith('<?xml')).toBe(true);
    expect(xml).toContain('<rss version="2.0">');
    expect(xml).toContain(articles[0].title);
    expect(xml).toContain(
      'https://gkablog.com/articles/personal-rag-vps',
    );
    expect(xml).toContain(articles[0].excerpt);
    expect(xml).toContain('<pubDate>');
  });
});
