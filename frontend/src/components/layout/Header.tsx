'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search } from 'lucide-react';
import { useState } from 'react';
import { AuthControls } from '@/components/auth/AuthControls';
import { MobileNav } from '@/components/layout/MobileNav';
import { useSearchOverlay } from '@/components/search/SearchContext';
import { Button } from '@/components/ui/Button';
import { isCurrentPath, NAV_LINKS } from '@/lib/nav';

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { setOpen } = useSearchOverlay();

  return (
    <header
      className={
        'fixed inset-x-0 top-0 z-40 border-b ' +
        'border-white/5 bg-[#05090a]/58 backdrop-blur-md'
      }
    >
      <a
        href='#main-content'
        className={
          'sr-only focus:not-sr-only focus:absolute ' +
          'focus:left-4 focus:top-3 focus:z-50 ' +
          'focus:rounded-full focus:bg-[#edf3ef] ' +
          'focus:px-4 focus:py-2 focus:text-sm ' +
          'focus:text-[#05090a]'
        }
      >
        Skip to content
      </a>
      <div
        className={
          'mx-auto flex h-16 max-w-6xl items-center ' +
          'justify-between gap-4 px-5 md:px-8'
        }
      >
        <Link
          href='/'
          aria-label='KIRILL'
          className={
            'brand focus-visible:outline-2 ' +
            'focus-visible:outline-offset-4 ' +
            'focus-visible:outline-[var(--accent)]'
          }
        >
          <span className='brand-name'>KIRILL</span>
          <span className='brand-divider' aria-hidden='true' />
          <span className='brand-tagline' aria-hidden='true'>
            <span>INSPIRED BY ME</span>
            <span>BUILT WITH AI</span>
          </span>
        </Link>
        <nav
          aria-label='Primary'
          className='hidden items-center gap-8 md:flex'
        >
          {NAV_LINKS.map((link) => {
            const current = isCurrentPath(pathname, link.href);

            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={current ? 'page' : undefined}
                className={
                  'relative pb-1 text-sm tracking-wide ' +
                  'transition-colors ' +
                  (current
                    ? 'text-[#61e6b3]'
                    : 'text-[#d7e2dc] hover:text-[#edf3ef]') +
                  ' focus-visible:outline-2 ' +
                  'focus-visible:outline-offset-4 ' +
                  'focus-visible:outline-[#61e6b3]'
                }
              >
                {link.label}
                {current ? (
                  <span
                    className={
                      'absolute inset-x-0 -bottom-0.5 h-px ' +
                      'bg-[#61e6b3] motion-safe:transition-all ' +
                      'motion-safe:duration-300'
                    }
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={() => setOpen(true)}
            aria-label='Open search'
            className={
              'rounded-full p-2 text-[#edf3ef] ' +
              'hover:bg-white/5 ' +
              'focus-visible:outline-2 ' +
              'focus-visible:outline-offset-4 ' +
              'focus-visible:outline-[#61e6b3]'
            }
          >
            <Search size={18} strokeWidth={1.6} />
          </button>
          <div className='md:hidden'>
            <AuthControls compact />
          </div>
          <div className='hidden md:block'>
            <AuthControls />
          </div>
          <div className='hidden md:block'>
            <Button
              href='mailto:hello@gkablog.com'
              variant='outline'
            >
              Get in touch
            </Button>
          </div>
          <button
            type='button'
            className={
              'rounded-full p-2 text-[#edf3ef] md:hidden ' +
              'focus-visible:outline-2 ' +
              'focus-visible:outline-offset-4 ' +
              'focus-visible:outline-[#61e6b3]'
            }
            aria-expanded={menuOpen}
            aria-controls='mobile-nav'
            aria-label='Open menu'
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={22} strokeWidth={1.6} />
          </button>
        </div>
      </div>
      <MobileNav
        open={menuOpen}
        links={NAV_LINKS}
        pathname={pathname}
        onClose={() => setMenuOpen(false)}
      />
    </header>
  );
}
