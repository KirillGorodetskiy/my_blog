import { describe, expect, it } from 'vitest';
import { articles } from '@/test/fixtures/articles';
import { projects } from '@/test/fixtures/projects';
import {
  getArticle,
  getAdjacentArticles,
  getProject,
  getRelatedArticles,
  getRelatedProjects,
} from '@/lib/content';

describe('getArticle', () => {
  it('returns the article for a known slug', () => {
    const article = getArticle('personal-rag-vps', articles);

    expect(article?.title).toContain('RAG');
  });

  it('returns undefined for an unknown slug', () => {
    expect(
      getArticle('missing-note', articles),
    ).toBeUndefined();
  });
});

describe('getProject', () => {
  it('returns the project for a known slug', () => {
    const project = getProject(
      'ai-lead-qualification',
      projects,
    );

    expect(project?.title).toContain('Lead Qualification');
  });

  it('returns undefined for an unknown slug', () => {
    expect(
      getProject('missing-build', projects),
    ).toBeUndefined();
  });
});

describe('getAdjacentArticles', () => {
  it('walks previous and next in date order', () => {
    const current = getArticle('finding-focus', articles);
    const { previous, next } = getAdjacentArticles(
      current?.slug ?? '',
      articles,
    );

    expect(previous?.slug).toBe('quiet-automation-desk');
    expect(next?.slug).toBe('building-ai-automations');
  });

  it('ends the chain on the newest article', () => {
    const newest = articles[0];
    const { next } = getAdjacentArticles(
      newest.slug,
      articles,
    );

    expect(next).toBeUndefined();
  });
});

describe('related content', () => {
  it('returns up to three other articles by tag', () => {
    const related = getRelatedArticles(
      'personal-rag-vps',
      articles,
    );

    expect(related.length).toBeGreaterThan(0);
    expect(related.length).toBeLessThanOrEqual(3);
    expect(
      related.some((item) => item.slug === 'personal-rag-vps'),
    ).toBe(false);
  });

  it('returns up to three other projects by technology', () => {
    const related = getRelatedProjects(
      'personal-rag-system',
      projects,
    );

    expect(related.length).toBeLessThanOrEqual(3);
    expect(
      related.some((item) => item.slug === 'personal-rag-system'),
    ).toBe(false);
  });

  it('falls back to the same category when tags do not match', () => {
    const related = getRelatedProjects(
      'home-lab-infrastructure',
      projects,
    );

    expect(related.every((item) => item.slug !==
      'home-lab-infrastructure')).toBe(true);
    expect(related.length).toBeGreaterThan(0);
  });
});

describe('detail records', () => {
  it('gives every article a body and tags', () => {
    for (const article of articles) {
      expect(article.body.length).toBeGreaterThan(40);
      expect(article.tags.length).toBeGreaterThan(0);
    }
  });

  it('keeps project facts from inventing empty urls', () => {
    for (const project of projects) {
      expect(project.status.length).toBeGreaterThan(0);
      expect(Array.isArray(project.technologies)).toBe(true);
      expect(
        project.githubUrl === null ||
          project.githubUrl.startsWith('https://'),
      ).toBe(true);
      expect(
        project.demoUrl === null ||
          project.demoUrl.startsWith('https://') ||
          project.demoUrl.startsWith('/'),
      ).toBe(true);
    }
  });
});
