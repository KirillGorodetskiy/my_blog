import { HeadingLink } from '@/components/article/HeadingLink';

const HEADING_TAGS = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
} as const;

interface HeadingBlockProps {
  id: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

export function HeadingBlock({
  id,
  level,
  children,
}: HeadingBlockProps) {
  const Tag = HEADING_TAGS[level];

  return (
    <Tag id={id} className='article-heading group'>
      <a href={`#${id}`} className='article-heading-text'>
        {children}
      </a>
      <HeadingLink headingId={id} />
    </Tag>
  );
}
