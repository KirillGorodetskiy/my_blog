'use client';

import { CopyButton } from '@/components/ui/CopyButton';

export function ShareActions({
  title,
  path,
}: {
  title: string;
  path: string;
}) {
  function absolutePath() {
    return new URL(path, window.location.origin).toString();
  }

  async function onShare() {
    if (typeof navigator.share !== 'function') {
      return;
    }

    try {
      await navigator.share({
        title,
        url: absolutePath(),
      });
    } catch {
      return;
    }
  }

  return (
    <div className='share-actions'>
      <CopyButton
        value={path}
        getValue={absolutePath}
        label='Copy link'
      />
      <button
        type='button'
        onClick={onShare}
        className={
          'rounded-full px-2.5 py-1 text-xs ' +
          'tracking-wide text-[#c3d0ca] ' +
          'hover:text-[#edf3ef] ' +
          'focus-visible:outline-2 ' +
          'focus-visible:outline-offset-4 ' +
          'focus-visible:outline-[#61e6b3]'
        }
      >
        Share
      </button>
    </div>
  );
}
