import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SearchProvider } from '@/components/search/SearchContext';
import { SearchShortcut } from '@/components/search/SearchShortcut';
import { useSearchOverlay } from '@/components/search/SearchContext';

function OpenFlag() {
  const { open } = useSearchOverlay();

  return <p>{open ? 'search-open' : 'search-closed'}</p>;
}

describe('SearchShortcut', () => {
  it('opens the palette on Control+K', async () => {
    const user = userEvent.setup();

    render(
      <SearchProvider>
        <SearchShortcut />
        <OpenFlag />
      </SearchProvider>,
    );

    expect(screen.getByText('search-closed')).toBeInTheDocument();

    await user.keyboard('{Control>}k{/Control}');

    expect(screen.getByText('search-open')).toBeInTheDocument();
  });
});
