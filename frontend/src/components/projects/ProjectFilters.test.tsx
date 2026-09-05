import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ProjectFilters } from '@/components/projects/ProjectFilters';

const OPTIONS = ['All', 'AI', 'Automation'] as const;

describe('ProjectFilters', () => {
  it('marks All as pressed by default', () => {
    render(
      <ProjectFilters
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
      <ProjectFilters
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

  it('does not render empty categories', () => {
    render(
      <ProjectFilters
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
