'use client';

import { useEffect, useRef } from 'react';

interface TurnstileApi {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      'expired-callback': () => void;
    },
  ) => string;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function TurnstileWidget({
  onToken,
}: {
  onToken: (token: string) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const siteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

  useEffect(() => {
    if (!siteKey || !hostRef.current) {
      return;
    }

    const mount = () => {
      if (!hostRef.current || !window.turnstile) {
        return;
      }
      window.turnstile.render(hostRef.current, {
        sitekey: siteKey,
        callback: onToken,
        'expired-callback': () => onToken(''),
      });
    };

    if (window.turnstile) {
      mount();
      return;
    }

    const script = document.createElement('script');
    script.src =
      'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.onload = mount;
    document.head.appendChild(script);
  }, [onToken, siteKey]);

  if (!siteKey) {
    return null;
  }

  return <div ref={hostRef} className='turnstile-widget' />;
}
