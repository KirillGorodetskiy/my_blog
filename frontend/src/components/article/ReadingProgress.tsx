'use client';

import { useEffect, useState } from 'react';

export function ReadingProgress({
  targetId,
}: {
  targetId: string;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const target = document.getElementById(targetId);

      if (!target) {
        setProgress(0);
        return;
      }

      const start = target.offsetTop;
      const max = target.offsetHeight - window.innerHeight;
      const next =
        max <= 0
          ? 100
          : Math.min(
              100,
              Math.max(
                0,
                ((window.scrollY - start) / max) * 100,
              ),
            );

      setProgress(next);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, {
      passive: true,
    });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [targetId]);

  return (
    <div
      className='reading-progress'
      role='progressbar'
      aria-label='Reading progress'
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      <span
        className='reading-progress-bar'
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
