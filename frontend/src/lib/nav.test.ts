import { describe, expect, it } from 'vitest';
import { isCurrentPath } from '@/lib/nav';

describe('isCurrentPath', () => {
  it('treats Home as an exact match', () => {
    expect(isCurrentPath('/', '/')).toBe(true);
    expect(isCurrentPath('/articles', '/')).toBe(false);
  });

  it('treats article detail as part of Articles', () => {
    expect(
      isCurrentPath('/articles/personal-rag-vps', '/articles'),
    ).toBe(true);
  });
});
