'use client';

import { motion } from 'motion/react';
import { useRoomTransition } from '@/components/transitions/TransitionContext';
import {
  getRoomTransition,
  heroArtVariants,
  heroTextVariants,
} from '@/components/transitions/variants';

export function HeroArtwork({
  children,
}: {
  children: React.ReactNode;
}) {
  const state = useRoomTransition();
  const options = {
    difference: state.difference,
    compact: state.compact,
    reduced: state.reduced,
  };

  if (!state.isClient) {
    return (
      <div className='relative h-full w-full'>{children}</div>
    );
  }

  return (
    <motion.div
      custom={options}
      variants={heroArtVariants}
      transition={getRoomTransition(options)}
      className='relative h-full w-full'
    >
      {children}
    </motion.div>
  );
}

export function HeroCopy({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const state = useRoomTransition();
  const options = {
    difference: state.difference,
    compact: state.compact,
    reduced: state.reduced,
  };

  if (!state.isClient) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      custom={options}
      variants={heroTextVariants}
      transition={getRoomTransition(options)}
      className={className}
    >
      {children}
    </motion.div>
  );
}
