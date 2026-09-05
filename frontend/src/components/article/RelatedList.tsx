import Link from 'next/link';
import { MarkdownInline } from '@/components/markdown/MarkdownInline';

interface RelatedItem {
  slug: string;
  title: string;
  detail: string;
}

export function RelatedList({
  title,
  basePath,
  items,
}: {
  title: string;
  basePath: '/articles' | '/projects';
  items: RelatedItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className='related-block'>
      <h2 className='related-title'>{title}</h2>
      <ul className='related-list'>
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`${basePath}/${item.slug}`}
              className='related-link'
            >
              <span className='related-item-title'>
                {item.title}
              </span>
              <span className='related-item-detail'>
                <MarkdownInline
                  source={item.detail}
                  allowLinks={false}
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
