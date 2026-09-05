'use client';

import { preload } from 'react-dom';
import { useRoomTransition } from '@/components/transitions/TransitionContext';
import { getAdjacentHeroSources } from '@/lib/room-navigation';

export function AdjacentRoomPreload() {
  const { pathname } = useRoomTransition();

  for (const href of getAdjacentHeroSources(pathname)) {
    preload(href, { as: 'image' });
  }

  return null;
}
