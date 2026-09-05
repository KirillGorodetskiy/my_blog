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
  layer: 'page' | 'hero' | 'text',
): number {
  return getLayerDistance(
    options.difference,
    layer,
    options.compact,
    options.reduced,
  );
}

function pageScale(options: VariantOptions): number {
  if (options.reduced || options.difference === 0) {
    return 1;
  }

  return 0.995;
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
    x: layerShift(options, 'page'),
    opacity: 0,
    scale: pageScale(options),
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    position: 'relative',
  },
  exit: (options: VariantOptions) => ({
    x: -layerShift(options, 'page'),
    opacity: 0,
    scale: pageScale(options),
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    pointerEvents: 'none',
  }),
};

export const heroArtVariants: Variants = {
  enter: (options: VariantOptions) => ({
    x:
      layerShift(options, 'hero') - layerShift(options, 'page'),
    scale: heroScale(options),
  }),
  center: { x: 0, scale: 1 },
  exit: (options: VariantOptions) => ({
    x: -(
      layerShift(options, 'hero') - layerShift(options, 'page')
    ),
    scale: heroScale(options),
  }),
};

export const heroTextVariants: Variants = {
  enter: (options: VariantOptions) => ({
    x:
      layerShift(options, 'text') - layerShift(options, 'page'),
  }),
  center: { x: 0 },
  exit: (options: VariantOptions) => ({
    x: -(
      layerShift(options, 'text') - layerShift(options, 'page')
    ),
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
