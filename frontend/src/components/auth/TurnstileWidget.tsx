'use client';

import { useEffect, useRef } from 'react';

interface TurnstileApi {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      'expired-callback': () => void;
      'error-callback': () => void;
    },
  ) => string;
  reset: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function TurnstileWidget({
  onToken,
  resetSignal = 0,
}: {
  onToken: (token: string) => void;
  resetSignal?: number;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

  useEffect(() => {
    if (!siteKey || !hostRef.current) {
      return;
    }

    const mount = () => {
      if (
        !hostRef.current ||
        !window.turnstile ||
        widgetIdRef.current
      ) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(
        hostRef.current,
        {
          sitekey: siteKey,
          callback: onToken,
          'expired-callback': () => onToken(''),
          'error-callback': () => onToken(''),
        },
      );
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

  useEffect(() => {
    if (!resetSignal || !widgetIdRef.current) {
      return;
    }

    window.turnstile?.reset(widgetIdRef.current);
    onToken('');
  }, [onToken, resetSignal]);

  if (!siteKey) {
    return null;
  }

  return <div ref={hostRef} className='turnstile-widget' />;
}
