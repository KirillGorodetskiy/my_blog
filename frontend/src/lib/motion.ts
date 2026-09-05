import type { Variants } from 'motion/react';

const DESKTOP_OFFSET = 56;
const MOBILE_OFFSET = 16;

export const ROOM_TRANSITION = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function getRoomVariants(
  direction: number,
  reduced: boolean,
  compact: boolean,
): Variants {
  if (reduced) {
    return {
      enter: { opacity: 0 },
      center: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }

  const offset = compact ? MOBILE_OFFSET : DESKTOP_OFFSET;

  return {
    enter: {
      x: direction * offset,
      opacity: 0,
      scale: 0.985,
    },
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: {
      x: direction * -offset,
      opacity: 0,
      scale: 0.985,
    },
  };
}
