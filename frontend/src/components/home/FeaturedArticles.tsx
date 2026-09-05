import { featuredItems } from '@/lib/filters';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { ArticleList } from '@/data/types';

export function FeaturedArticles({
  articles,
}: {
  articles: ArticleList[];
}) {
  const featured = featuredItems(articles, 3);

  return (
    <section className='mx-auto max-w-6xl px-5 py-16 md:px-8'>
      <SectionHeading
        title='Featured Articles'
        href='/articles'
        linkLabel='View all →'
      />
      <div className='grid gap-6 md:grid-cols-3'>
        {featured.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
