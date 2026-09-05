import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  ContentMedia,
  hasUsableMediaSrc,
} from '@/components/ui/ContentMedia';

describe('hasUsableMediaSrc', () => {
  it('accepts site and remote image urls', () => {
    expect(hasUsableMediaSrc('/media/posts/a.jpg')).toBe(true);
    expect(
      hasUsableMediaSrc('https://cdn.example/a.jpg'),
    ).toBe(true);
  });

  it('rejects empty values', () => {
    expect(hasUsableMediaSrc('')).toBe(false);
    expect(hasUsableMediaSrc('   ')).toBe(false);
  });
});

describe('ContentMedia', () => {
  it('renders an image when a src exists', () => {
    render(
      <ContentMedia
        src='/media/posts/cover.jpg'
        label='Cover'
      />,
    );

    expect(
      screen.getByRole('img', { name: 'Cover' }).getAttribute(
        'src',
      ),
    ).toContain('/media/posts/cover.jpg');
  });

  it('falls back to a placeholder without a src', () => {
    render(
      <ContentMedia src='' label='Pending artwork' />,
    );

    expect(
      screen.getByRole('img', { name: 'Pending artwork' }),
    ).toHaveTextContent('Placeholder');
  });
});
