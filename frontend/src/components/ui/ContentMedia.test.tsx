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
        role='article-hero'
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

  it('covers decorative hero images', () => {
    const { container } = render(
      <ContentMedia
        role='article-hero'
        src='/media/posts/cover.jpg'
        label='Hero'
      />,
    );

    expect(
      container.querySelector('.article-hero-image'),
    ).not.toBeNull();
    expect(
      screen.getByRole('img', { name: 'Hero' }),
    ).toHaveClass('object-cover');
  });

  it('contains project thumbnails so titles stay visible', () => {
    const { container } = render(
      <ContentMedia
        role='project-thumbnail'
        src='/media/projects/blog.png'
        label='Artwork for My Blog Website'
        objectPosition='50% 20%'
      />,
    );

    const frame = container.querySelector('.project-thumbnail');
    const image = screen.getByRole('img', {
      name: 'Artwork for My Blog Website',
    });

    expect(frame).not.toBeNull();
    expect(image).toHaveClass('object-contain');
    expect(image).not.toHaveClass('object-cover');
    expect(image).toHaveStyle({ objectPosition: '50% 20%' });
  });

  it('keeps content images at their natural height', () => {
    const { container } = render(
      <ContentMedia
        role='article-content-image'
        src='/media/posts/diagram.png'
        label='Architecture diagram'
      />,
    );

    const image = screen.getByRole('img', {
      name: 'Architecture diagram',
    });

    expect(
      container.querySelector('.article-content-image'),
    ).toBe(image);
    expect(image).not.toHaveClass('object-cover');
    expect(image).not.toHaveClass('object-contain');
    expect(image.parentElement).not.toHaveClass('relative');
  });

  it('keeps screenshots readable without cropping', () => {
    render(
      <ContentMedia
        role='article-screenshot'
        src='/media/projects/shot.png'
        label='Bot settings screen'
      />,
    );

    const image = screen.getByRole('img', {
      name: 'Bot settings screen',
    });

    expect(image).toHaveClass('article-screenshot');
    expect(image).not.toHaveClass('object-cover');
  });

  it('falls back to a placeholder without a src', () => {
    render(
      <ContentMedia
        role='project-thumbnail'
        src=''
        label='Pending artwork'
      />,
    );

    expect(
      screen.getByRole('img', { name: 'Pending artwork' }),
    ).toHaveTextContent('Placeholder');
  });
});
