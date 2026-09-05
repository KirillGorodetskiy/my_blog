import type { Variants } from 'motion/react';
import {
  getLayerDistance,
  getTransitionDuration,
  ROOM_EASE,
} from '@/lib/room-navigation';

export interface VariantOptions {
  difference: number;
  compact: boolean;
  reduced: boolean;
}

function layerShift(
  options: VariantOptions,
  layer: 'hero' | 'text',
): number {
  return getLayerDistance(
    options.difference,
    layer,
    options.compact,
    options.reduced,
  );
}

function heroScale(options: VariantOptions): number {
  if (
    options.reduced ||
    options.compact ||
    options.difference === 0
  ) {
    return 1;
  }

  return 1.015;
}

export const pageVariants: Variants = {
  enter: (options: VariantOptions) => ({
    opacity: 0,
    y: options.reduced ? 0 : 8,
    x: 0,
    scale: 1,
  }),
  center: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: 0,
    x: 0,
    scale: 1,
  },
};

export const heroArtVariants: Variants = {
  enter: (options: VariantOptions) => ({
    x: layerShift(options, 'hero'),
    scale: heroScale(options),
  }),
  center: { x: 0, scale: 1 },
  exit: (options: VariantOptions) => ({
    x: -layerShift(options, 'hero'),
    scale: heroScale(options),
  }),
};

export const heroTextVariants: Variants = {
  enter: (options: VariantOptions) => ({
    x: layerShift(options, 'text'),
  }),
  center: { x: 0 },
  exit: (options: VariantOptions) => ({
    x: -layerShift(options, 'text'),
  }),
};

export function getRoomTransition(options: VariantOptions) {
  return {
    duration: getTransitionDuration(
      options.reduced,
      options.compact,
    ),
    ease: ROOM_EASE,
  };
}
