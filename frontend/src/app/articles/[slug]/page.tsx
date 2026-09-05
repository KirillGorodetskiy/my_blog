import { notFound } from 'next/navigation';
import { ArticleBody } from '@/components/article/ArticleBody';
import { ArticlePager } from '@/components/article/ArticlePager';
import { ReadingProgress } from '@/components/article/ReadingProgress';
import { RelatedList } from '@/components/article/RelatedList';
import { ShareActions } from '@/components/article/ShareActions';
import { TableOfContents } from '@/components/article/TableOfContents';
import { MediaPlaceholder } from '@/components/ui/MediaPlaceholder';
import { articles } from '@/data/articles';
import {
  getAdjacentArticles,
  getArticle,
  getRelatedArticles,
} from '@/lib/content';
import { formatDate } from '@/lib/dates';
import { extractHeadings, parseMarkdown } from '@/lib/markdown';
import { articleMetadata } from '@/lib/metadata';

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/articles/[slug]'>) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    return { title: 'Article' };
  }

  return articleMetadata(article);
}

export default async function ArticleDetailPage({
  params,
}: PageProps<'/articles/[slug]'>) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  const headings = extractHeadings(parseMarkdown(article.body));
  const { previous, next } = getAdjacentArticles(article.slug);
  const related = getRelatedArticles(article.slug);

  return (
    <article>
      <ReadingProgress targetId='article-read' />
      <header className='article-hero'>
        <p className='article-kicker'>
          {formatDate(article.date)}
          <span aria-hidden='true'> · </span>
          {article.readTimeMinutes} min read
        </p>
        <h1 className='article-title'>{article.title}</h1>
        <p className='article-excerpt'>{article.excerpt}</p>
        <ul className='article-tags'>
          {article.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <MediaPlaceholder
          src={article.image}
          label={`Pending artwork for ${article.title}`}
          className='article-cover'
        />
      </header>
      <div className='article-shell' id='article-read'>
        <div className='article-layout'>
          <TableOfContents headings={headings} />
          <div className='article-main'>
            <ArticleBody source={article.body} />
            <ShareActions
              title={article.title}
              path={`/articles/${article.slug}`}
            />
            <ArticlePager previous={previous} next={next} />
            <RelatedList
              title='Related articles'
              basePath='/articles'
              items={related.map((item) => ({
                slug: item.slug,
                title: item.title,
                detail: item.excerpt,
              }))}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
