import { describe, expect, it } from 'vitest';
import { escapeHtml, highlightCode } from '@/lib/highlight';

describe('highlightCode', () => {
  it('escapes markup before wrapping tokens', () => {
    expect(escapeHtml('<em>')).toBe('&lt;em&gt;');
    expect(highlightCode('const room = 0;', 'ts')).toContain(
      'tok-kw',
    );
    expect(highlightCode('<script>', 'text')).toBe(
      '&lt;script&gt;',
    );
  });
});
