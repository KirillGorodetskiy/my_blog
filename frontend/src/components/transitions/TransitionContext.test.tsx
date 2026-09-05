import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  TransitionProvider,
  useRoomTransition,
} from '@/components/transitions/TransitionContext';

const path = { current: '/' };

vi.mock('next/navigation', () => ({
  usePathname: () => path.current,
}));

function Probe() {
  const state = useRoomTransition();

  return (
    <div
      data-testid='transition-state'
      data-path={state.pathname}
      data-previous={state.previousPath}
      data-difference={String(state.difference)}
      data-keys={Object.keys(state).join(',')}
    />
  );
}

describe('TransitionProvider', () => {
  it('does not snapshot or expose an exit ghost', () => {
    path.current = '/';
    render(
      <TransitionProvider>
        <Probe />
      </TransitionProvider>,
    );

    const node = screen.getByTestId('transition-state');

    expect(node.dataset.keys).not.toContain('exitGhost');
    expect(document.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it('keeps the previous pathname until the transition settles', () => {
    path.current = '/';
    const { rerender } = render(
      <TransitionProvider>
        <Probe />
      </TransitionProvider>,
    );

    path.current = '/articles';
    rerender(
      <TransitionProvider>
        <Probe />
      </TransitionProvider>,
    );

    const node = screen.getByTestId('transition-state');

    expect(node.dataset.path).toBe('/articles');
    expect(node.dataset.previous).toBe('/');
    expect(node.dataset.difference).toBe('-1');
  });
});
