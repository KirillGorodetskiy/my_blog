'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { edgeCuesFor } from '@/lib/edge-cues';

export function EdgeCues() {
  const pathname = usePathname();
  const cues = edgeCuesFor(pathname);

  if (!cues) {
    return null;
  }

  return (
    <nav className='edge-cues' aria-label='Room edges'>
      {cues.left ? (
        <Link
          href={cues.left.href}
          className='edge-cue edge-cue-left'
        >
          <span>{cues.left.label}</span>
        </Link>
      ) : null}
      {cues.right ? (
        <Link
          href={cues.right.href}
          className='edge-cue edge-cue-right'
        >
          <span>{cues.right.label}</span>
        </Link>
      ) : null}
    </nav>
  );
}
