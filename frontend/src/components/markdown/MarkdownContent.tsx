'use client';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { markdownElements } from '@/components/markdown/markdownElements';
import { rehypeHeadingIds } from '@/lib/headingIds';
import { isSafeHref } from '@/lib/markdown';

function urlTransform(url: string): string {
  return isSafeHref(url) ? url : '';
}

export function MarkdownContent({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  const classes = ['article-body', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHeadingIds]}
        skipHtml
        urlTransform={urlTransform}
        components={markdownElements}
      >
        {source}
      </Markdown>
    </div>
  );
}
