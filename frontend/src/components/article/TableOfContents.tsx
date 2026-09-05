'use client';

import { useEffect, useState } from 'react';
import type { TocHeading } from '@/lib/markdown';

export function TableOfContents({
  headings,
}: {
  headings: TocHeading[];
}) {
  const [activeId, setActiveId] = useState(
    headings[0]?.id ?? '',
  );

  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    const nodes = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((node): node is HTMLElement => node !== null);

    if (nodes.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) =>
              left.boundingClientRect.top -
              right.boundingClientRect.top,
          );

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-20% 0px -65% 0px',
        threshold: 0.1,
      },
    );

    for (const node of nodes) {
      observer.observe(node);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  const list = (
    <ol className='toc-list'>
      {headings.map((heading) => (
        <li
          key={heading.id}
          className={
            heading.level === 3 ? 'toc-item-h3' : undefined
          }
        >
          <a
            href={`#${heading.id}`}
            className={
              heading.id === activeId
                ? 'toc-link toc-link-active'
                : 'toc-link'
            }
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <nav aria-label='Table of contents' className='toc'>
      <div className='toc-desktop'>
        <p className='toc-title'>On this page</p>
        {list}
      </div>
      <details className='toc-mobile'>
        <summary className='toc-summary'>On this page</summary>
        {list}
      </details>
    </nav>
  );
}
