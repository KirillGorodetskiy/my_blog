import { describe, expect, it } from 'vitest';
import { PROJECT_CATEGORIES } from '@/data/types';
import { projects } from '@/test/fixtures/projects';
import { featuredItems } from '@/lib/filters';

describe('projects mock data', () => {
  it('provides six grounded projects', () => {
    expect(projects).toHaveLength(6);
  });

  it('includes the required featured titles', () => {
    const titles = featuredItems(projects, 3).map(
      (project) => project.title,
    );

    expect(titles).toEqual([
      'AI Lead Qualification & CRM Routing',
      'Personal RAG System',
      'Home Lab Infrastructure',
    ]);
  });

  it('gives every project the fields the cards need', () => {
    for (const project of projects) {
      expect(project.slug).toMatch(/^[a-z0-9-]+$/);
      expect(project.title.length).toBeGreaterThan(4);
      expect(PROJECT_CATEGORIES).toContain(project.category);
      expect(project.description.length).toBeGreaterThan(20);
      expect(project.image).toMatch(/^\/images\/projects\//);
    }
  });

  it('covers the named rebuild and tracker', () => {
    const titles = projects.map((project) => project.title);

    expect(titles).toContain('Missed Call AI Assistant');
    expect(titles).toContain('Blog Website (Rebuild)');
    expect(titles).toContain('Travel Tracker');
  });
});
