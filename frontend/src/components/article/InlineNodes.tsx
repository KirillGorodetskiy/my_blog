import type { InlineNode } from '@/lib/markdown';

export function InlineNodes({
  nodes,
}: {
  nodes: InlineNode[];
}) {
  return nodes.map((node, index) => {
    if (node.type === 'code') {
      return (
        <code key={index} className='article-inline-code'>
          {node.value}
        </code>
      );
    }

    if (node.type === 'link') {
      const external = node.href.startsWith('http');

      return (
        <a
          key={index}
          href={node.href}
          className='article-link'
          {...(external
            ? { rel: 'noopener noreferrer' }
            : {})}
        >
          <InlineNodes nodes={node.children} />
        </a>
      );
    }

    return <span key={index}>{node.value}</span>;
  });
}
