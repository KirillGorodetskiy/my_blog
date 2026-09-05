import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { projects } from '@/data/projects';

describe('ProjectCard', () => {
  it('links to the project detail route', () => {
    render(<ProjectCard project={projects[0]} />);

    expect(
      screen.getByRole('link', { name: /Lead Qualification/i }),
    ).toHaveAttribute(
      'href',
      '/projects/ai-lead-qualification',
    );
  });
});
