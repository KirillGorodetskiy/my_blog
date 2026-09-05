'use client';

import { CopyButton } from '@/components/ui/CopyButton';

export function HeadingLink({
  headingId,
}: {
  headingId: string;
}) {
  return (
    <CopyButton
      value={`#${headingId}`}
      getValue={() => {
        const url = new URL(window.location.href);
        url.hash = headingId;
        return url.toString();
      }}
      label='Copy link'
      className='article-heading-copy'
    />
  );
}
