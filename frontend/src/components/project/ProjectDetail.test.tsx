import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ProjectDetail } from '@/components/project/ProjectDetail';
import { projects } from '@/test/fixtures/projects';

vi.mock('@/components/auth/AuthContext', () => ({
  useAuth: () => ({
    user: {
      isAuthenticated: false,
      isStaff: false,
    },
    ready: true,
  }),
}));

const DESCRIPTION = [
  '## Homework-bot',
  '',
  'A backend-focused Telegram bot.',
  '',
  '### Key features',
  '',
  '- Send and receive messages',
  '- Store secrets in environment variables',
  '',
  '### Tech stack',
  '',
  '`Python` and `dotenv`',
  '',
  'See the [docs](https://example.com).',
  '',
  '1. clone',
  '2. run',
].join('\n');

describe('ProjectDetail', () => {
  it('renders project description as block Markdown', () => {
    render(
      <ProjectDetail
        project={{
          ...projects[0],
          title: 'Telegram Bot',
          description: DESCRIPTION,
        }}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Telegram Bot' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Homework-bot/ }),
    ).toHaveAttribute('id', 'homework-bot');
    expect(
      screen.getByRole('heading', { name: /Key features/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Send and receive messages').tagName,
    ).toBe('LI');
    expect(screen.getByText('clone').tagName).toBe('LI');
    expect(screen.getByText('Python').tagName).toBe('CODE');
    expect(
      screen.getByRole('link', { name: 'docs' }),
    ).toHaveAttribute('href', 'https://example.com');
    expect(
      screen.getByText('A backend-focused Telegram bot.')
        .tagName,
    ).toBe('P');
  });

  it('shows the cover and screenshots without cropping', () => {
    render(
      <ProjectDetail
        project={{
          ...projects[0],
          image: '/media/projects/cover.png',
          screenshots: [
            {
              src: '/media/projects/shot.png',
              alt: 'Settings screen',
              caption: 'Bot settings',
            },
          ],
        }}
      />,
    );

    const cover = screen.getByRole('img', {
      name: `Artwork for ${projects[0].title}`,
    });
    const shot = screen.getByRole('img', {
      name: 'Settings screen',
    });

    expect(cover).toHaveClass('article-content-image');
    expect(cover).not.toHaveClass('object-cover');
    expect(shot).toHaveClass('article-screenshot');
    expect(shot).not.toHaveClass('object-cover');
  });
});
