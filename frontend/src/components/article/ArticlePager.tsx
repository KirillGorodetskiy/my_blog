import Link from 'next/link';
import type { Article } from '@/data/types';

export function ArticlePager({
  previous,
  next,
}: {
  previous?: Article;
  next?: Article;
}) {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav
      aria-label='Adjacent articles'
      className='article-pager'
    >
      {previous ? (
        <Link
          href={`/articles/${previous.slug}`}
          className='article-pager-link'
        >
          <span className='article-pager-label'>Previous</span>
          <span className='article-pager-title'>
            {previous.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/articles/${next.slug}`}
          className='article-pager-link article-pager-next'
        >
          <span className='article-pager-label'>Next</span>
          <span className='article-pager-title'>
            {next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}
