'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ARTICLE_CATEGORIES } from '@/data/types';
import type { Article } from '@/data/types';
import {
  categoryToParam,
  filterByCategory,
  paramToCategory,
  usedCategories,
} from '@/lib/filters';
import { ArticleCard } from '@/components/articles/ArticleCard';
import {
  ArticleFilters,
  type ArticleFilterValue,
} from '@/components/articles/ArticleFilters';

export function ArticlesBrowser({
  articles,
}: {
  articles: Article[];
}) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const options = useMemo<ArticleFilterValue[]>(
    () => ['All', ...usedCategories(articles, ARTICLE_CATEGORIES)],
    [articles],
  );
  const active = paramToCategory(
    params.get('tag'),
    ARTICLE_CATEGORIES,
  );
  const visible = useMemo(
    () => filterByCategory(articles, active),
    [active, articles],
  );

  function onChange(value: ArticleFilterValue) {
    const next = new URLSearchParams(params.toString());

    if (value === 'All') {
      next.delete('tag');
    } else {
      next.set('tag', categoryToParam(value));
    }

    const query = next.toString();
    router.push(
      query ? `${pathname}?${query}` : pathname,
      { scroll: false },
    );
  }

  return (
    <section className='mx-auto max-w-6xl px-5 py-14 md:px-8'>
      <ArticleFilters
        active={active}
        options={options}
        onChange={onChange}
      />
      {visible.length === 0 ? (
        <p className='mt-16 text-center text-[#91a09a]'>
          Nothing in this aisle yet.
        </p>
      ) : (
        <div className='mt-10 grid gap-6 sm:grid-cols-2'>
          {visible.map((article) => (
            <ArticleCard
              key={article.slug}
              article={article}
            />
          ))}
        </div>
      )}
    </section>
  );
}
