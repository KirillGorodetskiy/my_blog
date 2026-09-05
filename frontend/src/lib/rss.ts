import type { ArticleList } from '@/data/types';
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/site';

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function rssDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00.000Z`).toUTCString();
}

export function buildArticlesRss(
  siteUrl: string,
  feedItems: ArticleList[],
): string {
  const origin = siteUrl.replace(/\/$/, '');
  const items = [...feedItems]
    .sort((left, right) =>
      right.date.localeCompare(left.date),
    )
    .map((article) => {
      const url = `${origin}/articles/${article.slug}`;

      return [
        '    <item>',
        `      <title>${escapeXml(article.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid>${escapeXml(url)}</guid>`,
        `      <pubDate>${rssDate(article.date)}</pubDate>`,
        '      <description>' +
          `${escapeXml(article.excerpt)}</description>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    `    <title>${escapeXml(SITE_NAME)}</title>`,
    `    <link>${escapeXml(origin)}</link>`,
    '    <description>' +
      `${escapeXml(SITE_DESCRIPTION)}</description>`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
