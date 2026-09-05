import type { MetadataRoute } from 'next';
import { articles } from '@/data/articles';
import { projects } from '@/data/projects';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '',
    '/articles',
    '/projects',
    '/about',
  ].map((path) => ({
    url: `${SITE_URL}${path || '/'}`,
    lastModified: new Date(),
  }));

  const articleRoutes = articles.map((article) => ({
    url: `${SITE_URL}/articles/${article.slug}`,
    lastModified: new Date(`${article.date}T00:00:00Z`),
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${SITE_URL}/projects/${project.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...articleRoutes, ...projectRoutes];
}
