import { describe, expect, it } from 'vitest';
import { articles } from '@/test/fixtures/articles';
import { projects } from '@/test/fixtures/projects';
import { getArticle, getProject } from '@/lib/content';
import {
  absoluteTitle,
  articleMetadata,
  projectMetadata,
} from '@/lib/metadata';

describe('metadata helpers', () => {
  it('builds an article title from the content', () => {
    const article = getArticle('personal-rag-vps', articles);

    expect(article).toBeDefined();
    expect(absoluteTitle(article?.title ?? '')).toBe(
      'How I Set Up a Personal RAG System on a VPS | Kirill',
    );
    expect(articleMetadata(article!).alternates?.canonical).toBe(
      '/articles/personal-rag-vps',
    );
  });

  it('builds a project title from the content', () => {
    const project = getProject(
      'ai-lead-qualification',
      projects,
    );

    expect(projectMetadata(project!).title).toEqual({
      absolute:
        'AI Lead Qualification & CRM Routing | Kirill',
    });
  });
});
