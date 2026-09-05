import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RoomTransition } from '@/components/transitions/RoomTransition';

vi.mock('@/components/transitions/TransitionContext', () => ({
  useRoomTransition: () => ({
    pathname: '/articles',
    previousPath: '/',
    difference: -1,
    compact: false,
    reduced: true,
    isClient: true,
    isTransitioning: false,
    markSettled: () => undefined,
  }),
}));

describe('RoomTransition', () => {
  it('renders only the live page without a cloned layer', () => {
    const { container } = render(
      <RoomTransition>
        <p>Live articles</p>
      </RoomTransition>,
    );

    expect(screen.getByText('Live articles')).toBeInTheDocument();
    expect(container.querySelector('#main-content')).not.toBeNull();
    expect(container.querySelector('.overflow-x-hidden')).toBeNull();
    expect(
      container.querySelector('[aria-hidden="true"]'),
    ).toBeNull();
    expect(container.querySelectorAll('main')).toHaveLength(1);
  });
});
