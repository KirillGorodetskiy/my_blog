import { articles } from '@/data/articles';
import { projects } from '@/data/projects';
import type { Article, Project } from '@/data/types';

function byDateAsc(left: Article, right: Article): number {
  return left.date.localeCompare(right.date);
}

export function getArticle(
  slug: string,
  collection: Article[] = articles,
): Article | undefined {
  return collection.find((article) => article.slug === slug);
}

export function getProject(
  slug: string,
  collection: Project[] = projects,
): Project | undefined {
  return collection.find((project) => project.slug === slug);
}

export function getAdjacentArticles(
  slug: string,
  collection: Article[] = articles,
): {
  previous?: Article;
  next?: Article;
} {
  const ordered = [...collection].sort(byDateAsc);
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
  collection: Article[] = articles,
): Article[] {
  const current = getArticle(slug, collection);

  if (!current) {
    return [];
  }

  const others = collection.filter((item) => item.slug !== slug);
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
  collection: Project[] = projects,
): Project[] {
  const current = getProject(slug, collection);

  if (!current) {
    return [];
  }

  const others = collection.filter((item) => item.slug !== slug);
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
