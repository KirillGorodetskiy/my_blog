import Link from 'next/link';
import { NAV_LINKS } from '@/lib/nav';
import { CONTACT_EMAIL } from '@/lib/site';

const FOOTER_LINK =
  'text-sm text-[#91a09a] transition-colors ' +
  'hover:text-[#edf3ef] ' +
  'focus-visible:outline-2 ' +
  'focus-visible:outline-offset-4 ' +
  'focus-visible:outline-[#61e6b3]';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className='border-t border-white/5 bg-[#05090a]'>
      <div
        className={
          'mx-auto flex max-w-6xl flex-col gap-2 ' +
          'px-5 py-3 md:px-8'
        }
      >
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
        <p className='brand min-w-0'>
          <span className='text-xs text-[#91a09a]'>
            {`© ${year}`}
          </span>
          <span className='brand-name'>KIRILL</span>
          <span className='brand-divider' aria-hidden='true' />
          <span className='brand-tagline' aria-hidden='true'>
            <span>INSPIRED BY ME</span>
            <span>BUILT WITH AI</span>
          </span>
        </p>
      </div>
    </footer>
  );
}
