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

  it('uses a contained project thumbnail', () => {
    const { container } = render(
      <ProjectCard project={projects[0]} />,
    );

    expect(
      container.querySelector('.project-thumbnail'),
    ).not.toBeNull();
    expect(
      screen.getByRole('img', {
        name: `Artwork for ${projects[0].title}`,
      }),
    ).toHaveClass('object-contain');
  });

  it('shows only the overview on the card', () => {
    render(
      <ProjectCard
        project={{
          ...projects[0],
          description: [
            '## Overview',
            '',
            'A Django blog built as a learning project.',
            '',
            '## Key Features',
            '',
            '- Post management',
          ].join('\n'),
        }}
      />,
    );

    expect(
      screen.getByText(
        'A Django blog built as a learning project.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Post management'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Key Features'),
    ).not.toBeInTheDocument();
  });

  it('renders the overview as plain readable text', () => {
    const { container } = render(
      <ProjectCard
        project={{
          ...projects[0],
          description: '**Django** with `PostgreSQL`',
        }}
      />,
    );

    expect(container.textContent).toContain(
      'Django with PostgreSQL',
    );
    expect(container.textContent).not.toContain('**');
  });
});
