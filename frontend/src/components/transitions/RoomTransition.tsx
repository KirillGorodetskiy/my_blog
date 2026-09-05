'use client';

import { motion } from 'motion/react';
import { useEffect } from 'react';
import { useRoomTransition } from '@/components/transitions/TransitionContext';
import { resetWindowScroll } from '@/lib/scroll';

export function RoomTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    isClient,
    pathname,
    isTransitioning,
    reduced,
    markSettled,
  } = useRoomTransition();

  useEffect(() => {
    if (!isClient) {
      return;
    }

    resetWindowScroll();
  }, [isClient, pathname]);

  useEffect(() => {
    if (!isClient || !isTransitioning) {
      return;
    }

    if (reduced) {
      markSettled();
    }
  }, [isClient, isTransitioning, reduced, markSettled]);

  if (!isClient) {
    return <main id='main-content'>{children}</main>;
  }

  return (
    <motion.main
      key={pathname}
      id='main-content'
      aria-busy={isTransitioning}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduced ? 0 : 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
      onAnimationComplete={markSettled}
    >
      {children}
    </motion.main>
  );
}
