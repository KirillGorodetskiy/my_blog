'use client';

import { usePathname } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useState,
  useSyncExternalStore,
} from 'react';
import { useReducedMotion } from 'motion/react';
import { getRoomDifference } from '@/lib/room-navigation';

function emptySubscribe() {
  return () => undefined;
}

function subscribeCompact(onStoreChange: () => void) {
  const media = window.matchMedia('(max-width: 767px)');
  media.addEventListener('change', onStoreChange);
  return () => media.removeEventListener('change', onStoreChange);
}

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

function useCompactViewport() {
  return useSyncExternalStore(
    subscribeCompact,
    () => window.matchMedia('(max-width: 767px)').matches,
    () => false,
  );
}

export interface RoomTransitionState {
  pathname: string;
  previousPath: string;
  difference: number;
  compact: boolean;
  reduced: boolean;
  isClient: boolean;
  isTransitioning: boolean;
  markSettled: () => void;
}

const RoomTransitionContext =
  createContext<RoomTransitionState | null>(null);

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const reduced = Boolean(useReducedMotion());
  const compact = useCompactViewport();
  const isClient = useIsClient();
  const [previousPath, setPreviousPath] = useState(pathname);
  const isTransitioning = previousPath !== pathname;

  const markSettled = useCallback(() => {
    setPreviousPath(pathname);
  }, [pathname]);

  return (
    <RoomTransitionContext.Provider
      value={{
        pathname,
        previousPath,
        difference: getRoomDifference(previousPath, pathname),
        compact,
        reduced,
        isClient,
        isTransitioning,
        markSettled,
      }}
    >
      {children}
    </RoomTransitionContext.Provider>
  );
}

export function useRoomTransition(): RoomTransitionState {
  const value = useContext(RoomTransitionContext);

  if (!value) {
    throw new Error('useRoomTransition needs TransitionProvider');
  }

  return value;
}
