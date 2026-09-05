import { describe, expect, it } from 'vitest';
import {
  DECORATIVE_ICON_KEYS,
  splitLeadingDecorative,
  stripLeadingDecorative,
} from '@/lib/decorativeIcons';

describe('splitLeadingDecorative', () => {
  it('maps a whitelisted leading marker', () => {
    expect(splitLeadingDecorative('✅ Reliable delivery')).toEqual({
      marker: '✅',
      rest: 'Reliable delivery',
    });
    expect(DECORATIVE_ICON_KEYS['✅']).toBe('check');
  });

  it('leaves normal text unchanged', () => {
    expect(splitLeadingDecorative('Reliable delivery')).toEqual({
      marker: null,
      rest: 'Reliable delivery',
    });
  });

  it('does not convert an unrelated emoji', () => {
    expect(splitLeadingDecorative('🎉 shipped today')).toEqual({
      marker: null,
      rest: '🎉 shipped today',
    });
  });

  it('does not convert a marker mid-sentence', () => {
    expect(
      splitLeadingDecorative('Delivery is ✅ complete'),
    ).toEqual({
      marker: null,
      rest: 'Delivery is ✅ complete',
    });
  });
});

describe('stripLeadingDecorative', () => {
  it('returns the text after a known marker', () => {
    expect(stripLeadingDecorative('🚀 Launch plan')).toBe(
      'Launch plan',
    );
  });
});
