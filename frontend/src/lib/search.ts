import { articles } from '@/data/articles';
import { projects } from '@/data/projects';
import type { Article, Project } from '@/data/types';

export type SearchGroup =
  | 'Articles'
  | 'Projects'
  | 'Navigation';

export interface SearchItem {
  group: SearchGroup;
  title: string;
  href: string;
  detail: string;
  haystack: string;
}

export const NAVIGATION: SearchItem[] = [
  {
    group: 'Navigation',
    title: 'Home',
    href: '/',
    detail: 'The shelter between the rooms',
    haystack: 'home shelter',
  },
  {
    group: 'Navigation',
    title: 'Articles',
    href: '/articles',
    detail: 'Notes from the library',
    haystack: 'articles library notes',
  },
  {
    group: 'Navigation',
    title: 'Projects',
    href: '/projects',
    detail: 'Work from the workshop',
    haystack: 'projects workshop',
  },
  {
    group: 'Navigation',
    title: 'About',
    href: '/about',
    detail: 'A quieter room',
    haystack: 'about kirill',
  },
];

export function buildSearchItems(
  articleItems: Article[] = articles,
  projectItems: Project[] = projects,
): SearchItem[] {
  const mappedArticles = articleItems.map((article) => ({
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

  const mappedProjects = projectItems.map((project) => ({
    group: 'Projects' as const,
    title: project.title,
    href: `/projects/${project.slug}`,
    detail: project.description,
    haystack: [
      project.title,
      project.description,
      project.category,
      ...project.technologies,
    ].join(' ').toLowerCase(),
  }));

  return [...mappedArticles, ...mappedProjects, ...NAVIGATION];
}

export function searchItems(
  items: SearchItem[],
  query: string,
): SearchItem[] {
  const needle = query.trim().toLowerCase();

  if (!needle) {
    return items;
  }

  return items.filter((item) =>
    item.haystack.includes(needle) ||
    item.title.toLowerCase().includes(needle) ||
    item.detail.toLowerCase().includes(needle),
  );
}

export function moveSearchIndex(
  current: number,
  delta: number,
  length: number,
): number {
  if (length === 0) {
    return 0;
  }

  return (current + delta + length) % length;
}

export function groupSearchItems(
  items: SearchItem[],
): { group: SearchGroup; items: SearchItem[] }[] {
  const order: SearchGroup[] = [
    'Articles',
    'Projects',
    'Navigation',
  ];

  return order
    .map((group) => ({
      group,
      items: items.filter((item) => item.group === group),
    }))
    .filter((entry) => entry.items.length > 0);
}
