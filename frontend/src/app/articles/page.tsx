import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ArticlesBrowser } from '@/components/articles/ArticlesBrowser';
import { ArticlesHero } from '@/components/articles/ArticlesHero';
import { listArticles } from '@/lib/api/articles';

export const metadata: Metadata = {
  title: 'Articles',
  description: 'Ideas, notes and lessons from the journey.',
  alternates: { canonical: '/articles' },
  openGraph: {
    title: 'Articles',
    description: 'Ideas, notes and lessons from the journey.',
    url: '/articles',
    images: [{ url: '/images/articles-hero.jpg' }],
  },
};

export const dynamic = 'force-dynamic';

export default async function ArticlesPage() {
  const articles = await listArticles();

  return (
    <>
      <ArticlesHero />
      <Suspense>
        <ArticlesBrowser articles={articles} />
      </Suspense>
    </>
  );
}
