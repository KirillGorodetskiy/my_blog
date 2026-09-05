import { listArticles } from '@/lib/api/articles';
import { buildArticlesRss } from '@/lib/rss';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';

export async function GET() {
  const articles = await listArticles();

  return new Response(buildArticlesRss(SITE_URL, articles), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
