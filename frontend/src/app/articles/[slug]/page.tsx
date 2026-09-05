import { notFound } from 'next/navigation';
import { ArticleBody } from '@/components/article/ArticleBody';
import { ArticlePager } from '@/components/article/ArticlePager';
import { ReadingProgress } from '@/components/article/ReadingProgress';
import { RelatedList } from '@/components/article/RelatedList';
import { ShareActions } from '@/components/article/ShareActions';
import { TableOfContents } from '@/components/article/TableOfContents';
import { CommentSection } from '@/components/comments/CommentSection';
import { StaffEditLink } from '@/components/content/StaffEditLink';
import { MarkdownInline } from '@/components/markdown/MarkdownInline';
import { ContentMedia } from '@/components/ui/ContentMedia';
import { listArticles } from '@/lib/api/articles';
import { loadArticle } from '@/lib/api/load';
import {
  getAdjacentArticles,
  getRelatedArticles,
} from '@/lib/content';
import { formatDate } from '@/lib/dates';
import { extractHeadings } from '@/lib/markdown';
import { articleMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: PageProps<'/articles/[slug]'>) {
  const { slug } = await params;
  const article = await loadArticle(slug);

  if (!article) {
    return { title: 'Article' };
  }

  return articleMetadata(article);
}

export default async function ArticleDetailPage({
  params,
}: PageProps<'/articles/[slug]'>) {
  const { slug } = await params;
  const article = await loadArticle(slug);

  if (!article) {
    notFound();
  }

  const articles = await listArticles();
  const headings = extractHeadings(article.body);
  const { previous, next } = getAdjacentArticles(
    article.slug,
    articles,
  );
  const related = getRelatedArticles(article.slug, articles, 3);

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
        <StaffEditLink
          kind='article'
          slug={article.slug}
          label='Edit article'
        />
        <p className='article-excerpt'>
          <MarkdownInline source={article.excerpt} />
        </p>
        <ul className='article-tags'>
          {article.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <ContentMedia
          src={article.image}
          label={`Artwork for ${article.title}`}
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
            <CommentSection
              kind='article'
              slug={article.slug}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
