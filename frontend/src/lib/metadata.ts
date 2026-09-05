import type { Metadata } from 'next';
import type { Article, Project } from '@/data/types';
import { SITE_NAME } from '@/lib/site';

export function absoluteTitle(title: string): string {
  return `${title} | ${SITE_NAME}`;
}

export function articleMetadata(article: Article): Metadata {
  const url = `/articles/${article.slug}`;

  return {
    title: { absolute: absoluteTitle(article.title) },
    description: article.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      url,
      images: [{ url: '/images/articles-hero.jpg' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
    },
  };
}

export function projectMetadata(project: Project): Metadata {
  const url = `/projects/${project.slug}`;

  return {
    title: { absolute: absoluteTitle(project.title) },
    description: project.description,
    alternates: { canonical: url },
    openGraph: {
      title: project.title,
      description: project.description,
      type: 'website',
      url,
      images: [{ url: '/images/projects-hero.jpg' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
    },
  };
}
