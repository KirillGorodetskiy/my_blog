import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
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

  it('debounces search requests', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ articles: [], projects: [] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(
      <SearchProvider>
        <OpenSearch>
          <SearchDialog />
        </OpenSearch>
      </SearchProvider>,
    );

    fireEvent.change(
      screen.getByRole('textbox', { name: 'Search' }),
      { target: { value: 'rag' } },
    );
    expect(fetchMock).not.toHaveBeenCalled();
    await act(async () => {
      vi.advanceTimersByTime(249);
    });
    expect(fetchMock).not.toHaveBeenCalled();
    await act(async () => {
      vi.advanceTimersByTime(2);
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('ignores a stale slower response', async () => {
    vi.useFakeTimers();
    let resolveOld: ((value: unknown) => void) | undefined;
    const fetchMock = vi.fn()
      .mockImplementationOnce(
        () => new Promise((resolve) => {
          resolveOld = resolve;
        }),
      )
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          articles: [
            {
              slug: 'fresh-note',
              title: 'Fresh note',
              excerpt: 'fresh',
              category: 'Development',
              tags: [],
            },
          ],
          projects: [],
        }),
      });
    vi.stubGlobal('fetch', fetchMock);

    render(
      <SearchProvider>
        <OpenSearch>
          <SearchDialog />
        </OpenSearch>
      </SearchProvider>,
    );

    const box = screen.getByRole('textbox', { name: 'Search' });
    fireEvent.change(box, { target: { value: 'not' } });
    await act(async () => {
      vi.advanceTimersByTime(250);
    });
    fireEvent.change(box, { target: { value: 'note' } });
    await act(async () => {
      vi.advanceTimersByTime(250);
    });
    vi.useRealTimers();

    await waitFor(() => {
      expect(
        screen.getByRole('option', { name: /Fresh note/i }),
      ).toBeInTheDocument();
    });

    await act(async () => {
      resolveOld?.({
        ok: true,
        status: 200,
        json: async () => ({
          articles: [
            {
              slug: 'stale-note',
              title: 'Stale note',
              excerpt: 'stale',
              category: 'Development',
              tags: [],
            },
          ],
          projects: [],
        }),
      });
    });

    expect(
      screen.getByRole('option', { name: /Fresh note/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: /Stale note/i }),
    ).not.toBeInTheDocument();
  });
});
