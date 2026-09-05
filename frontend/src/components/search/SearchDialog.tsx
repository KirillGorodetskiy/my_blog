'use client';

import { useRouter } from 'next/navigation';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { MarkdownInline } from '@/components/markdown/MarkdownInline';
import { useSearchOverlay } from '@/components/search/SearchContext';
import { searchContent } from '@/lib/api/search';
import { searchHitsToItems } from '@/lib/api/searchMap';
import {
  groupSearchItems,
  moveSearchIndex,
  NAVIGATION,
  searchItems,
  type SearchItem,
} from '@/lib/search';

function emptySubscribe() {
  return () => undefined;
}

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function SearchDialog() {
  const isClient = useIsClient();
  const router = useRouter();
  const { open, setOpen } = useSearchOverlay();
  const [query, setQuery] = useState('');
  const [remote, setRemote] = useState<SearchItem[]>([]);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const catalog = query.trim() ? remote : NAVIGATION;
  const results = useMemo(
    () => searchItems(catalog, query),
    [catalog, query],
  );
  const groups = useMemo(
    () => groupSearchItems(results),
    [results],
  );

  useEffect(() => {
    const needle = query.trim();

    if (!needle) {
      return;
    }

    let cancelled = false;
    searchContent(needle)
      .then((hits) => {
        if (!cancelled) {
          setRemote(searchHitsToItems(hits));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRemote(NAVIGATION);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      setQuery('');
      setActive(0);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }

    if (!open && dialog.open) {
      if (typeof dialog.close === 'function') {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
      }
    }
  }, [open]);

  if (!isClient) {
    return null;
  }

  function close() {
    setOpen(false);
  }

  function openResult(index: number) {
    const item = results[index];

    if (!item) {
      return;
    }

    close();
    router.push(item.href);
  }

  return (
    <dialog
      ref={dialogRef}
      className='search-dialog'
      aria-labelledby='search-title'
      onClose={close}
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          close();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setActive((index) =>
            moveSearchIndex(index, 1, results.length),
          );
        }

        if (event.key === 'ArrowUp') {
          event.preventDefault();
          setActive((index) =>
            moveSearchIndex(index, -1, results.length),
          );
        }

        if (event.key === 'Enter') {
          event.preventDefault();
          openResult(active);
        }

        if (event.key === 'Escape') {
          event.preventDefault();
          close();
        }
      }}
    >
      <div className='search-panel'>
        <h2 id='search-title' className='sr-only'>
          Search
        </h2>
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              openResult(active);
            }
          }}
          placeholder='Search...'
          aria-label='Search'
          className='search-input'
        />
        <div className='search-results' role='listbox'>
          {groups.length === 0 ? (
            <p className='search-empty'>No matches.</p>
          ) : (
            groups.map((group) => (
              <section key={group.group}>
                <h3 className='search-group'>{group.group}</h3>
                <ul>
                  {group.items.map((item) => {
                    const index = results.indexOf(item);

                    return (
                      <li key={item.href + item.title}>
                        <button
                          type='button'
                          role='option'
                          aria-selected={index === active}
                          className={
                            index === active
                              ? 'search-item search-item-active'
                              : 'search-item'
                          }
                          onMouseEnter={() => setActive(index)}
                          onClick={() => openResult(index)}
                        >
                          <span>{item.title}</span>
                          <span className='search-item-detail'>
                            <MarkdownInline
                              source={item.detail}
                              allowLinks={false}
                            />
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))
          )}
        </div>
      </div>
    </dialog>
  );
}
