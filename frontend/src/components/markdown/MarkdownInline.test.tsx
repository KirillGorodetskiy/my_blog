import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MarkdownInline } from '@/components/markdown/MarkdownInline';

describe('MarkdownInline', () => {
  it('renders preview formatting without leaking markers', () => {
    const { container } = render(
      <MarkdownInline source='**Django** + `PostgreSQL`' />,
    );

    expect(screen.getByText('Django').tagName).toBe('STRONG');
    expect(screen.getByText('PostgreSQL').tagName).toBe('CODE');
    expect(container.textContent).not.toContain('**');
    expect(container.textContent).not.toContain('`');
  });

  it('does not insert headings into compact copy', () => {
    render(
      <MarkdownInline source='## Architecture\n\nKeep this short.' />,
    );

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(
      screen.getByText(/Architecture/),
    ).toBeInTheDocument();
  });

  it('maps a leading decorative marker', () => {
    const { container } = render(
      <MarkdownInline source='💡 Quiet note' />,
    );

    expect(
      container.querySelector('[data-icon="idea"]'),
    ).toBeInTheDocument();
    expect(container.textContent).toContain('Quiet note');
  });
});
