'use client';

import { useEffect } from 'react';
import { useSearchOverlay } from '@/components/search/SearchContext';

export function SearchShortcut() {
  const { open, setOpen } = useSearchOverlay();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const chord =
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === 'k';

      if (!chord) {
        return;
      }

      event.preventDefault();
      setOpen(!open);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  return null;
}
