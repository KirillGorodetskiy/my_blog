import type { SearchResponse } from '@/lib/api/search';
import type { SearchItem } from '@/lib/search';
import { projectCardSummary } from '@/lib/markdown';
import { NAVIGATION } from '@/lib/search';

export function searchHitsToItems(
  hits: SearchResponse,
): SearchItem[] {
  const articles = hits.articles.map((article) => ({
    group: 'Articles' as const,
    title: article.title,
    href: `/articles/${article.slug}`,
    detail: article.excerpt,
    haystack: [
      article.title,
      article.excerpt,
      article.category,
      ...article.tags,
    ].join(' ').toLowerCase(),
  }));
  const projects = hits.projects.map((project) => ({
    group: 'Projects' as const,
    title: project.title,
    href: `/projects/${project.slug}`,
    detail: projectCardSummary(project.description),
    haystack: [
      project.title,
      project.description,
      project.category,
      ...project.technologies,
    ].join(' ').toLowerCase(),
  }));

  return [...articles, ...projects, ...NAVIGATION];
}
