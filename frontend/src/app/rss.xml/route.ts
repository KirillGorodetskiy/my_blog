import { buildArticlesRss } from '@/lib/rss';
import { SITE_URL } from '@/lib/site';

export function GET() {
  return new Response(buildArticlesRss(SITE_URL), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
