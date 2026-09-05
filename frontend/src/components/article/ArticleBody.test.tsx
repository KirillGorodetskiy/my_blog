import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ArticleBody } from '@/components/article/ArticleBody';

const SOURCE = [
  '## Setup',
  '',
  'A paragraph with `inline` and a',
  '[link](https://example.com).',
  '',
  '```ts',
  'const room = 0;',
  '```',
].join('\n');

describe('ArticleBody', () => {
  it('renders headings, links, inline code, and fences', () => {
    render(<ArticleBody source={SOURCE} />);

    expect(
      screen.getByRole('heading', { name: /Setup/ }),
    ).toHaveAttribute('id', 'setup');
    expect(
      screen.getByRole('link', { name: 'link' }),
    ).toHaveAttribute('href', 'https://example.com');
    expect(screen.getByText('inline').tagName).toBe('CODE');
    expect(screen.getByText('ts')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy' }))
      .toBeInTheDocument();
  });
});
