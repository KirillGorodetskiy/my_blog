import Link from 'next/link';

interface SectionHeadingProps {
  title: string;
  href?: string;
  linkLabel?: string;
}

export function SectionHeading({
  title,
  href,
  linkLabel,
}: SectionHeadingProps) {
  return (
    <div
      className={
        'mb-8 flex items-end justify-between gap-4'
      }
    >
      <h2
        className={
          'font-serif text-3xl font-medium tracking-tight ' +
          'text-[var(--text)] md:text-4xl'
        }
      >
        {title}
      </h2>
      {href && linkLabel ? (
        <Link
          href={href}
          className={
            'text-sm text-[var(--accent)] transition-colors ' +
            'hover:text-[#8ff0cb] ' +
            'focus-visible:outline-2 ' +
            'focus-visible:outline-offset-4 ' +
            'focus-visible:outline-[#61e6b3]'
          }
        >
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}
