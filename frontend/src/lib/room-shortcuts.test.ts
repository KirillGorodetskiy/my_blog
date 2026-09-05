import { describe, expect, it } from 'vitest';
import { roomShortcutTarget } from '@/lib/room-shortcuts';

describe('roomShortcutTarget', () => {
  it('moves from Home to the library and workshop', () => {
    expect(roomShortcutTarget('/', 'ArrowLeft')).toBe(
      '/articles',
    );
    expect(roomShortcutTarget('/', 'ArrowRight')).toBe(
      '/projects',
    );
  });

  it('returns Home from the article and project rooms', () => {
    expect(
      roomShortcutTarget('/articles/personal-rag-vps', 'ArrowRight'),
    ).toBe('/');
    expect(
      roomShortcutTarget('/projects/travel-tracker', 'ArrowLeft'),
    ).toBe('/');
  });

  it('ignores typing, modifiers, and unused keys', () => {
    expect(
      roomShortcutTarget('/', 'ArrowLeft', { typing: true }),
    ).toBeNull();
    expect(
      roomShortcutTarget('/', 'ArrowRight', { modified: true }),
    ).toBeNull();
    expect(roomShortcutTarget('/about', 'ArrowLeft')).toBeNull();
    expect(roomShortcutTarget('/', 'Escape')).toBeNull();
  });
});
