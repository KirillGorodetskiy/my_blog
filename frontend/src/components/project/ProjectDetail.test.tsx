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
});
