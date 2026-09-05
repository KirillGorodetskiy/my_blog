import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ArticleFilters } from '@/components/articles/ArticleFilters';

const OPTIONS = ['All', 'AI', 'Life'] as const;

describe('ArticleFilters', () => {
  it('marks All as pressed by default', () => {
    render(
      <ArticleFilters
        active='All'
        options={OPTIONS}
        onChange={() => undefined}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'All' }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  it('notifies when a category is chosen', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <ArticleFilters
        active='All'
        options={OPTIONS}
        onChange={onChange}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'AI' }),
    );

    expect(onChange).toHaveBeenCalledWith('AI');
  });

  it('hides empty categories', () => {
    render(
      <ArticleFilters
        active='All'
        options={OPTIONS}
        onChange={() => undefined}
      />,
    );

    expect(
      screen.queryByRole('button', { name: 'Hardware' }),
    ).not.toBeInTheDocument();
  });
});
