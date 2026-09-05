import { describe, expect, it } from 'vitest';
import { edgeCuesFor } from '@/lib/edge-cues';

describe('edgeCuesFor', () => {
  it('shows library and workshop from the shelter', () => {
    expect(edgeCuesFor('/')).toEqual({
      left: { href: '/articles', label: '← Library' },
      right: { href: '/projects', label: 'Workshop →' },
    });
  });

  it('returns to the shelter from the library', () => {
    expect(edgeCuesFor('/articles')).toEqual({
      left: null,
      right: { href: '/', label: 'Shelter →' },
    });
    expect(
      edgeCuesFor('/articles/personal-rag-vps')?.right?.href,
    ).toBe('/');
  });

  it('returns to the shelter from the workshop', () => {
    expect(edgeCuesFor('/projects')).toEqual({
      left: { href: '/', label: '← Shelter' },
      right: null,
    });
    expect(
      edgeCuesFor('/projects/travel-tracker')?.left?.href,
    ).toBe('/');
  });

  it('hides cues on about and unknown paths', () => {
    expect(edgeCuesFor('/about')).toBeNull();
    expect(edgeCuesFor('/missing-room')).toBeNull();
  });
});
