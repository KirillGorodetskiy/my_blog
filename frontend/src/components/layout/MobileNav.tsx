'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { AuthControls } from '@/components/auth/AuthControls';
import { isCurrentPath } from '@/lib/nav';

export interface MobileNavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  open: boolean;
  links: MobileNavLink[];
  pathname: string;
  onClose: () => void;
}

export function MobileNav({
  open,
  links,
  pathname,
  onClose,
}: MobileNavProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className='mobile-nav'
      role='dialog'
      aria-modal='true'
      aria-label='Menu'
      id='mobile-nav'
    >
      <button
        type='button'
        className='mobile-nav-backdrop'
        aria-label='Close menu overlay'
        onClick={onClose}
      />
      <div className='mobile-nav-panel'>
        <div className='flex items-center justify-between'>
          <p className='brand'>
            <span className='brand-name'>KIRILL</span>
            <span className='brand-divider' aria-hidden='true' />
            <span className='brand-tagline' aria-hidden='true'>
              <span>INSPIRED BY ME</span>
              <span>BUILT WITH AI</span>
            </span>
          </p>
          <button
            type='button'
            onClick={onClose}
            className={
              'rounded-full p-2 text-[#edf3ef] ' +
              'focus-visible:outline-2 ' +
              'focus-visible:outline-offset-4 ' +
              'focus-visible:outline-[#61e6b3]'
            }
            aria-label='Close menu'
          >
            <X size={22} strokeWidth={1.6} />
          </button>
        </div>
        <nav aria-label='Mobile' className='mobile-nav-links'>
          {links.map((link) => {
            const current = isCurrentPath(pathname, link.href);

            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={current ? 'page' : undefined}
                onClick={onClose}
                className={
                  'mobile-nav-link ' +
                  (current
                    ? 'mobile-nav-link-current'
                    : 'mobile-nav-link-idle') +
                  ' focus-visible:outline-2 ' +
                  'focus-visible:outline-offset-4 ' +
                  'focus-visible:outline-[#61e6b3]'
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className='mt-8'>
          <AuthControls />
        </div>
        <a
          href='mailto:hello@gkablog.com'
          className={
            'mt-auto w-fit rounded-full border ' +
            'border-[#61e6b3]/40 px-5 py-2.5 text-sm ' +
            'text-[#edf3ef] ' +
            'focus-visible:outline-2 ' +
            'focus-visible:outline-offset-4 ' +
            'focus-visible:outline-[#61e6b3]'
          }
        >
          Get in touch
        </a>
      </div>
    </div>,
    document.body,
  );
}
