import Link from 'next/link';
import { formatDate } from '@/lib/dates';
import type { Article } from '@/data/articles';
import { ContentMedia } from '@/components/ui/ContentMedia';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article
      className={
        'group overflow-hidden rounded-2xl border ' +
        'border-[#183032] bg-[#091112] transition-colors ' +
        'hover:border-[#245055] ' +
        'focus-within:outline-2 ' +
        'focus-within:outline-offset-4 ' +
        'focus-within:outline-[#61e6b3]'
      }
    >
      <Link
        href={`/articles/${article.slug}`}
        className='block'
      >
        <ContentMedia
          src={article.image}
          label={`Artwork for ${article.title}`}
          className='aspect-[16/10] w-full'
        />
        <div className='space-y-3 px-5 py-5'>
          <p className='text-sm text-[#91a09a]'>
            {formatDate(article.date)}
            <span aria-hidden='true'> · </span>
            <span>{article.readTimeMinutes} min read</span>
          </p>
          <h3
            className={
              'font-serif text-2xl leading-snug ' +
              'text-[#edf3ef]'
            }
          >
            {article.title}
          </h3>
          <p
            className={
              'inline-flex rounded-full bg-[#173d33] ' +
              'px-2.5 py-1 text-xs tracking-wide ' +
              'text-[#61e6b3]'
            }
          >
            {article.category}
          </p>
        </div>
      </Link>
    </article>
  );
}
