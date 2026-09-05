import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ArticlesBrowser } from '@/components/articles/ArticlesBrowser';
import { ArticlesHero } from '@/components/articles/ArticlesHero';

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

export default function ArticlesPage() {
  return (
    <>
      <ArticlesHero />
      <Suspense>
        <ArticlesBrowser />
      </Suspense>
    </>
  );
}
