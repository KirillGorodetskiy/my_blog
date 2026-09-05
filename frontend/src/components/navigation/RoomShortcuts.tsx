'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSearchOverlay } from '@/components/search/SearchContext';
import {
  isTypingTarget,
  roomShortcutTarget,
} from '@/lib/room-shortcuts';

export function RoomShortcuts() {
  const pathname = usePathname();
  const router = useRouter();
  const { open } = useSearchOverlay();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = roomShortcutTarget(pathname, event.key, {
        typing: isTypingTarget(event.target) || open,
        modified:
          event.metaKey ||
          event.ctrlKey ||
          event.altKey ||
          event.shiftKey,
      });

      if (!target) {
        return;
      }

      event.preventDefault();
      router.push(target);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, pathname, router]);

  return null;
}
