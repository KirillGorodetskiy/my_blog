import type { ReactNode } from 'react';
import type { Components } from 'react-markdown';
import { CodeBlock } from '@/components/article/CodeBlock';
import { HeadingBlock } from '@/components/article/HeadingBlock';
import { ContentMedia } from '@/components/ui/ContentMedia';
import { decorateChildren } from '@/components/markdown/decorateChildren';
import { isSafeHref } from '@/lib/markdown';

function heading(
  level: 1 | 2 | 3 | 4 | 5 | 6,
): NonNullable<Components['h1']> {
  return function MarkdownHeading({ id, children }) {
    return (
      <HeadingBlock id={id ?? ''} level={level}>
        {decorateChildren(children)}
      </HeadingBlock>
    );
  };
}

function MarkdownLink({
  href,
  children,
}: {
  href?: string;
  children?: ReactNode;
}) {
  if (!href || !isSafeHref(href)) {
    return <>{children}</>;
  }

  const external = href.startsWith('http');

  return (
    <a
      href={href}
      className='article-link'
      {...(external ? { rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
}

function MarkdownCode({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const value = String(children).replace(/\n$/, '');
  const language = className?.startsWith('language-')
    ? className.slice('language-'.length) || 'text'
    : null;

  if (language !== null || value.includes('\n')) {
    return (
      <CodeBlock language={language ?? 'text'} value={value} />
    );
  }

  return <code className='article-inline-code'>{children}</code>;
}

export const markdownElements: Components = {
  h1: heading(1),
  h2: heading(2),
  h3: heading(3),
  h4: heading(4),
  h5: heading(5),
  h6: heading(6),
  p: ({ children }) => (
    <p className='article-p'>{decorateChildren(children)}</p>
  ),
  strong: ({ children }) => <strong>{children}</strong>,
  em: ({ children }) => <em>{children}</em>,
  del: ({ children }) => <del>{children}</del>,
  a: MarkdownLink,
  code: MarkdownCode,
  pre: ({ children }) => <>{children}</>,
  ul: ({ children, className }) => (
    <ul
      className={
        className
          ? `article-list ${className}`
          : 'article-list'
      }
    >
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className='article-list'>{children}</ol>
  ),
  li: ({ children }) => (
    <li>{decorateChildren(children)}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className='article-quote'>
      {decorateChildren(children)}
    </blockquote>
  ),
  img: ({ src, alt }) => {
    const href = typeof src === 'string' ? src : '';

    if (!href || !isSafeHref(href)) {
      return null;
    }

    return (
      <figure className='article-figure'>
        <ContentMedia
          src={href}
          label={alt || `Figure · ${href}`}
          className='aspect-[16/9] w-full rounded-xl'
        />
        {alt ? (
          <figcaption className='article-caption'>
            {alt}
          </figcaption>
        ) : null}
      </figure>
    );
  },
  table: ({ children }) => (
    <div className='article-table-wrap'>
      <table className='article-table'>{children}</table>
    </div>
  ),
  th: ({ children }) => <th>{children}</th>,
  td: ({ children }) => <td>{children}</td>,
  hr: () => <hr className='article-rule' />,
  input: ({ type, checked }) => {
    if (type !== 'checkbox') {
      return null;
    }

    return (
      <input
        type='checkbox'
        checked={Boolean(checked)}
        disabled
        readOnly
        className='article-task'
      />
    );
  },
};

export const inlineMarkdownElements: Components = {
  p: ({ children }) => <>{decorateChildren(children)}</>,
  strong: ({ children }) => <strong>{children}</strong>,
  em: ({ children }) => <em>{children}</em>,
  del: ({ children }) => <del>{children}</del>,
  a: MarkdownLink,
  code: ({ children }) => (
    <code className='article-inline-code'>{children}</code>
  ),
};
