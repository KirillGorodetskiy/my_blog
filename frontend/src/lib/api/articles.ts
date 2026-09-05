import type { Article, ArticleList } from '@/data/types';
import { fetchJson } from '@/lib/api/client';

export function listArticles(): Promise<ArticleList[]> {
  return fetchJson<ArticleList[]>('/api/v1/articles/');
}

export function getArticleBySlug(
  slug: string,
): Promise<Article> {
  return fetchJson<Article>(`/api/v1/articles/${slug}/`);
}
