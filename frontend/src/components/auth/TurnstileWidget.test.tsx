import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TurnstileWidget } from '@/components/auth/TurnstileWidget';

describe('TurnstileWidget', () => {
  afterEach(() => {
    delete window.turnstile;
    vi.unstubAllEnvs();
  });

  it('resets the official widget id when resetSignal changes', () => {
    const reset = vi.fn();
    const onToken = vi.fn();
    vi.stubEnv('NEXT_PUBLIC_TURNSTILE_SITE_KEY', 'site-key');
    window.turnstile = {
      render: () => 'widget-1',
      reset,
    };

    const { rerender } = render(
      <TurnstileWidget onToken={onToken} resetSignal={0} />,
    );
    rerender(
      <TurnstileWidget onToken={onToken} resetSignal={1} />,
    );

    expect(reset).toHaveBeenCalledWith('widget-1');
    expect(onToken).toHaveBeenCalledWith('');
  });
});
