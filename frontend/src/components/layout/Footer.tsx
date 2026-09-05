import Link from 'next/link';
import { NAV_LINKS } from '@/lib/nav';
import { CONTACT_EMAIL, SITE_DESCRIPTION, SITE_NAME } from '@/lib/site';

const FOOTER_LINK =
  'text-sm text-[#91a09a] transition-colors ' +
  'hover:text-[#edf3ef] ' +
  'focus-visible:outline-2 ' +
  'focus-visible:outline-offset-4 ' +
  'focus-visible:outline-[#61e6b3]';

export function Footer() {
  const year = new Date().getFullYear();
  const copyright = `© ${year} ${SITE_NAME}`;

  return (
    <footer className='border-t border-white/5 bg-[#05090a]'>
      <div
        className={
          'mx-auto flex max-w-6xl flex-col gap-2 ' +
          'px-5 py-3 md:flex-row md:items-center ' +
          'md:justify-between md:gap-6 md:px-8'
        }
      >
        <p
          className={
            'flex min-w-0 flex-wrap items-baseline ' +
            'gap-x-3 gap-y-0.5'
          }
        >
          <span
            className={
              'text-sm font-semibold tracking-[0.28em] ' +
              'text-[#edf3ef]'
            }
          >
            {SITE_NAME.toUpperCase()}
          </span>
          <span className='text-xs text-[#91a09a]'>
            {SITE_DESCRIPTION}
          </span>
        </p>
        <div
          className={
            'flex flex-wrap items-center gap-x-5 gap-y-1'
          }
        >
          <nav
            aria-label='Rooms'
            className='flex flex-wrap items-center gap-x-5 gap-y-1'
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={FOOTER_LINK}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <nav
            aria-label='Elsewhere'
            className='flex flex-wrap items-center gap-x-5 gap-y-1'
          >
            <Link href='/rss.xml' className={FOOTER_LINK}>
              RSS
            </Link>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className={FOOTER_LINK}
            >
              Get in touch
            </a>
          </nav>
        </div>
        <p className='shrink-0 text-xs text-[#91a09a]'>
          {copyright}
        </p>
      </div>
    </footer>
  );
}
