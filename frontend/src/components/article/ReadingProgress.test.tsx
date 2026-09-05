import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReadingProgress } from '@/components/article/ReadingProgress';

describe('ReadingProgress', () => {
  it('renders a progressbar without a target node', () => {
    render(<ReadingProgress targetId='missing-read' />);

    expect(
      screen.getByRole('progressbar', {
        name: 'Reading progress',
      }),
    ).toHaveAttribute('aria-valuenow', '0');
  });
});
