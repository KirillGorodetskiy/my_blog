import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchDialog } from '@/components/search/SearchDialog';
import { SearchProvider } from '@/components/search/SearchContext';
import { useSearchOverlay } from '@/components/search/SearchContext';
import { useEffect } from 'react';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

function OpenSearch({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setOpen } = useSearchOverlay();

  useEffect(() => {
    setOpen(true);
  }, [setOpen]);

  return children;
}

describe('SearchDialog', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          articles: [
            {
              slug: 'personal-rag-vps',
              title: 'How I Set Up a Personal RAG System on a VPS',
              excerpt: 'A quiet retrieval setup',
              category: 'Development',
              tags: ['rag'],
            },
          ],
          projects: [],
        }),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });
  it('filters results and opens the selected article', async () => {
    const user = userEvent.setup();

    render(
      <SearchProvider>
        <OpenSearch>
          <SearchDialog />
        </OpenSearch>
      </SearchProvider>,
    );

    await user.type(
      screen.getByRole('textbox', { name: 'Search' }),
      'rag',
    );

    await waitFor(() => {
      expect(
        screen.getByRole('option', {
          name: /Personal RAG System on a VPS/i,
        }),
      ).toBeInTheDocument();
    });

    await user.keyboard('{Enter}');

    expect(push).toHaveBeenCalledWith(
      '/articles/personal-rag-vps',
    );
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();

    render(
      <SearchProvider>
        <OpenSearch>
          <SearchDialog />
        </OpenSearch>
      </SearchProvider>,
    );

    expect(document.querySelector('dialog')).toHaveAttribute(
      'open',
    );

    await user.keyboard('{Escape}');

    expect(document.querySelector('dialog')).not.toHaveAttribute(
      'open',
    );
  });
});
