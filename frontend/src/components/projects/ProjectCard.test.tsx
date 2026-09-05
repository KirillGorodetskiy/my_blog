import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { projects } from '@/test/fixtures/projects';

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

  it('renders inline markdown in the description', () => {
    const { container } = render(
      <ProjectCard
        project={{
          ...projects[0],
          description: '**Django** + `PostgreSQL`',
        }}
      />,
    );

    expect(screen.getByText('Django').tagName).toBe('STRONG');
    expect(screen.getByText('PostgreSQL').tagName).toBe('CODE');
    expect(container.textContent).not.toContain('**');
  });
});
