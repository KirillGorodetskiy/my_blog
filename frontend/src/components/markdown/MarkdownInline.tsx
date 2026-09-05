'use client';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { inlineMarkdownElements } from '@/components/markdown/markdownElements';
import { isSafeHref } from '@/lib/markdown';

const INLINE_ELEMENTS = [
  'p',
  'strong',
  'em',
  'del',
  'a',
  'code',
];

function urlTransform(url: string): string {
  return isSafeHref(url) ? url : '';
}

export function MarkdownInline({
  source,
  allowLinks = true,
}: {
  source: string;
  allowLinks?: boolean;
}) {
  const allowed = allowLinks
    ? INLINE_ELEMENTS
    : INLINE_ELEMENTS.filter((tag) => tag !== 'a');

  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      skipHtml
      unwrapDisallowed
      allowedElements={allowed}
      urlTransform={urlTransform}
      components={inlineMarkdownElements}
    >
      {source}
    </Markdown>
  );
}
