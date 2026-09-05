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

  return (
    <footer className='border-t border-white/5 bg-[#05090a]'>
      <div
        className={
          'mx-auto grid max-w-6xl gap-10 px-5 py-12 ' +
          'md:grid-cols-3 md:px-8'
        }
      >
        <div>
          <p
            className={
              'text-sm font-semibold tracking-[0.28em] ' +
              'text-[#edf3ef]'
            }
          >
            {SITE_NAME.toUpperCase()}
          </p>
          <p
            className={
              'mt-3 max-w-xs text-sm leading-relaxed ' +
              'text-[#91a09a]'
            }
          >
            {SITE_DESCRIPTION}
          </p>
        </div>
        <nav aria-label='Footer'>
          <p className='text-xs tracking-wide text-[#d7e2dc]'>
            Rooms
          </p>
          <ul className='mt-4 flex flex-col gap-2'>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={FOOTER_LINK}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className='text-xs tracking-wide text-[#d7e2dc]'>
            Elsewhere
          </p>
          <ul className='mt-4 flex flex-col gap-2'>
            <li>
              <Link href='/rss.xml' className={FOOTER_LINK}>
                RSS
              </Link>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className={FOOTER_LINK}
              >
                Get in touch
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div
        className={
          'mx-auto max-w-6xl border-t border-white/5 ' +
          'px-5 py-5 text-xs text-[#91a09a] md:px-8'
        }
      >
        © {year} {SITE_NAME}
      </div>
    </footer>
  );
}
