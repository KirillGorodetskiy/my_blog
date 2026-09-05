'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useLayoutEffect, useRef } from 'react';
import { useRoomTransition } from '@/components/transitions/TransitionContext';
import {
  getRoomTransition,
  pageVariants,
} from '@/components/transitions/variants';
import { resetWindowScroll } from '@/lib/scroll';

interface MotionOptions {
  difference: number;
  compact: boolean;
  reduced: boolean;
}

function copyPageStyles(shadow: ShadowRoot) {
  const sheets: CSSStyleSheet[] = [
    ...document.adoptedStyleSheets,
  ];

  for (const sheet of document.styleSheets) {
    try {
      sheets.push(sheet);
    } catch {
      continue;
    }
  }

  try {
    shadow.adoptedStyleSheets = sheets;
  } catch {
    const style = document.createElement('style');
    const rules: string[] = [];

    for (const sheet of document.styleSheets) {
      try {
        const css = [...sheet.cssRules]
          .map((rule) => rule.cssText)
          .join('\n');
        rules.push(css);
      } catch {
        continue;
      }
    }

    style.textContent = rules.join('\n');
    shadow.append(style);
  }
}

function ExitGhost({
  html,
  options,
  onComplete,
}: {
  html: string;
  options: MotionOptions;
  onComplete: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const host = hostRef.current;

    if (!host) {
      return;
    }

    const shadow =
      host.shadowRoot ?? host.attachShadow({ mode: 'open' });
    copyPageStyles(shadow);

    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    shadow.append(wrap);

    return () => {
      shadow.replaceChildren();
    };
  }, [html]);

  return (
    <motion.div
      aria-hidden='true'
      custom={options}
      variants={pageVariants}
      initial='center'
      animate='exit'
      transition={getRoomTransition(options)}
      onAnimationComplete={onComplete}
      className='pointer-events-none absolute left-0 top-0 w-full'
    >
      <div ref={hostRef} />
    </motion.div>
  );
}

export function RoomTransition({
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

  useLayoutEffect(() => {
    if (!state.isClient) {
      return;
    }

    resetWindowScroll();
  }, [state.isClient, state.pathname]);

  if (!state.isClient) {
    return <main id='main-content'>{children}</main>;
  }

  return (
    <div className='relative overflow-x-hidden'>
      {state.exitGhost ? (
        <ExitGhost
          html={state.exitGhost}
          options={options}
          onComplete={state.markSettled}
        />
      ) : null}
      <AnimatePresence initial={false} custom={options}>
        <motion.main
          key={state.pathname}
          id='main-content'
          aria-busy={state.isTransitioning}
          custom={options}
          variants={pageVariants}
          initial='enter'
          animate='center'
          transition={getRoomTransition(options)}
          onAnimationComplete={
            state.exitGhost ? undefined : state.markSettled
          }
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
