import { ApiError } from '@/lib/api/client';
import { getArticleBySlug } from '@/lib/api/articles';
import { getProjectBySlug } from '@/lib/api/projects';
import type { Article, Project } from '@/data/types';

export async function loadArticle(
  slug: string,
): Promise<Article | null> {
  try {
    return await getArticleBySlug(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function loadProject(
  slug: string,
): Promise<Project | null> {
  try {
    return await getProjectBySlug(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
