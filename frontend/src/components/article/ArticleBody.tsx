import { CodeBlock } from '@/components/article/CodeBlock';
import { HeadingBlock } from '@/components/article/HeadingBlock';
import { InlineNodes } from '@/components/article/InlineNodes';
import { ContentMedia } from '@/components/ui/ContentMedia';
import {
  parseMarkdown,
  type ContentBlock,
} from '@/lib/markdown';

function BlockView({ block }: { block: ContentBlock }) {
  if (block.type === 'heading') {
    return (
      <HeadingBlock id={block.id} level={block.level}>
        <InlineNodes nodes={block.children} />
      </HeadingBlock>
    );
  }

  if (block.type === 'paragraph') {
    return (
      <p className='article-p'>
        <InlineNodes nodes={block.children} />
      </p>
    );
  }

  if (block.type === 'quote') {
    return (
      <blockquote className='article-quote'>
        <InlineNodes nodes={block.children} />
      </blockquote>
    );
  }

  if (block.type === 'list') {
    const Tag = block.ordered ? 'ol' : 'ul';

    return (
      <Tag className='article-list'>
        {block.items.map((item, index) => (
          <li key={index}>
            <InlineNodes nodes={item} />
          </li>
        ))}
      </Tag>
    );
  }

  if (block.type === 'code') {
    return (
      <CodeBlock language={block.language} value={block.value} />
    );
  }

  return (
    <figure className='article-figure'>
      <ContentMedia
        src={block.src}
        label={block.alt || `Figure · ${block.src}`}
        className='aspect-[16/9] w-full rounded-xl'
      />
      {block.alt ? (
        <figcaption className='article-caption'>
          {block.alt}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function ArticleBody({ source }: { source: string }) {
  const blocks = parseMarkdown(source);

  return (
    <div className='article-body'>
      {blocks.map((block, index) => (
        <BlockView key={`${block.type}-${index}`} block={block} />
      ))}
    </div>
  );
}
