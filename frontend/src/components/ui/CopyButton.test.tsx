import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CopyButton } from '@/components/ui/CopyButton';

describe('CopyButton', () => {
  it('changes label after a successful copy', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {
      ...navigator,
      clipboard: { writeText },
    });

    render(<CopyButton value='https://gkablog.com/articles' />);

    await user.click(screen.getByRole('button', { name: 'Copy' }));

    expect(writeText).toHaveBeenCalledWith(
      'https://gkablog.com/articles',
    );
    expect(
      screen.getByRole('button', { name: 'Copied' }),
    ).toBeInTheDocument();
  });
});
