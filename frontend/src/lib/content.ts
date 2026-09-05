import { articles } from '@/data/articles';
import { projects } from '@/data/projects';
import type { Article, Project } from '@/data/types';

function byDateAsc(left: Article, right: Article): number {
  return left.date.localeCompare(right.date);
}

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getAdjacentArticles(slug: string): {
  previous?: Article;
  next?: Article;
} {
  const ordered = [...articles].sort(byDateAsc);
  const index = ordered.findIndex((item) => item.slug === slug);

  if (index === -1) {
    return {};
  }

  return {
    previous: ordered[index - 1],
    next: ordered[index + 1],
  };
}

function overlap(left: string[], right: string[]): number {
  const wanted = new Set(
    right.map((value) => value.toLowerCase()),
  );

  return left.filter((value) =>
    wanted.has(value.toLowerCase()),
  ).length;
}

export function getRelatedArticles(
  slug: string,
  limit = 3,
): Article[] {
  const current = getArticle(slug);

  if (!current) {
    return [];
  }

  const others = articles.filter((item) => item.slug !== slug);
  const tagged = others
    .map((item) => ({
      item,
      score: overlap(item.tags, current.tags),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .map((entry) => entry.item);

  if (tagged.length > 0) {
    return tagged.slice(0, limit);
  }

  const sameCategory = others.filter(
    (item) => item.category === current.category,
  );

  if (sameCategory.length > 0) {
    return sameCategory.slice(0, limit);
  }

  return others.slice(0, limit);
}

export function getRelatedProjects(
  slug: string,
  limit = 3,
): Project[] {
  const current = getProject(slug);

  if (!current) {
    return [];
  }

  const others = projects.filter((item) => item.slug !== slug);
  const tagged = others
    .map((item) => ({
      item,
      score: overlap(
        item.technologies,
        current.technologies,
      ),
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .map((entry) => entry.item);

  if (tagged.length > 0) {
    return tagged.slice(0, limit);
  }

  const sameCategory = others.filter(
    (item) => item.category === current.category,
  );

  if (sameCategory.length > 0) {
    return sameCategory.slice(0, limit);
  }

  return others.slice(0, limit);
}
