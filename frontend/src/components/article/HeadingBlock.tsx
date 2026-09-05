import { HeadingLink } from '@/components/article/HeadingLink';

interface HeadingBlockProps {
  id: string;
  level: 2 | 3;
  children: React.ReactNode;
}

export function HeadingBlock({
  id,
  level,
  children,
}: HeadingBlockProps) {
  const Tag = level === 2 ? 'h2' : 'h3';

  return (
    <Tag id={id} className='article-heading group'>
      <a href={`#${id}`} className='article-heading-text'>
        {children}
      </a>
      <HeadingLink headingId={id} />
    </Tag>
  );
}
