import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MarkdownContent } from '@/components/markdown/MarkdownContent';

describe('MarkdownContent', () => {
  it('renders strong, emphasis, and strikethrough', () => {
    render(
      <MarkdownContent source='**bold** *italic* ~~deleted~~' />,
    );

    expect(screen.getByText('bold').tagName).toBe('STRONG');
    expect(screen.getByText('italic').tagName).toBe('EM');
    expect(screen.getByText('deleted').tagName).toBe('DEL');
  });

  it('keeps list markup as ul and ol items', () => {
    const { container } = render(
      <MarkdownContent
        source={[
          '### Features',
          '',
          '- first',
          '- second',
          '',
          '1. alpha',
          '2. beta',
        ].join('\n')}
      />,
    );

    expect(container.querySelector('ul.article-list')).not.toBeNull();
    expect(container.querySelector('ol.article-list')).not.toBeNull();
    expect(
      container.querySelectorAll('ul.article-list > li'),
    ).toHaveLength(2);
    expect(
      container.querySelectorAll('ol.article-list > li'),
    ).toHaveLength(2);
    expect(
      screen.getByRole('heading', { name: /Features/ }).tagName,
    ).toBe('H3');
  });

  it('renders lists, links, and fenced code', () => {
    render(
      <MarkdownContent
        source={[
          '- one',
          '- two',
          '',
          'See [docs](https://example.com).',
          '',
          '```ts',
          'const room = 0;',
          '```',
        ].join('\n')}
      />,
    );

    expect(screen.getByText('one').tagName).toBe('LI');
    expect(
      screen.getByRole('link', { name: 'docs' }),
    ).toHaveAttribute('href', 'https://example.com');
    expect(screen.getByText('ts')).toBeInTheDocument();
    expect(screen.getByText('const')).toBeInTheDocument();
  });

  it('assigns deterministic heading ids', () => {
    render(
      <MarkdownContent source='## Docker architecture' />,
    );

    expect(
      screen.getByRole('heading', {
        name: /Docker architecture/,
      }),
    ).toHaveAttribute('id', 'docker-architecture');
  });

  it('does not leak markdown in project-style copy', () => {
    const { container } = render(
      <MarkdownContent
        source={
          'The app uses **Django** behind Nginx.\n\n- PostgreSQL'
        }
      />,
    );

    expect(container.textContent).toContain('Django');
    expect(container.textContent).not.toContain('**');
    expect(screen.getByText('PostgreSQL').tagName).toBe('LI');
  });

  it('does not execute raw HTML', () => {
    render(
      <MarkdownContent
        source={'<script>window.__pwned = 1</script><em>raw</em>'}
      />,
    );

    expect(screen.queryByText('raw')).not.toBeInTheDocument();
    expect(
      document.querySelector('script'),
    ).not.toBeInTheDocument();
    expect(
      (window as Window & { __pwned?: number }).__pwned,
    ).toBeUndefined();
  });

  it('replaces a whitelisted decorative marker with an icon', () => {
    const { container } = render(
      <MarkdownContent source='✅ Reliable delivery' />,
    );

    expect(
      container.querySelector('[data-icon="check"]'),
    ).toBeInTheDocument();
    expect(container.textContent).toContain('Reliable delivery');
    expect(container.textContent).not.toContain('✅');
  });

  it('maps the educational marker to a site icon', () => {
    const { container } = render(
      <MarkdownContent source='🧠 Educational example' />,
    );

    expect(
      container.querySelector('[data-icon="education"]'),
    ).toBeInTheDocument();
    expect(container.textContent).toContain(
      'Educational example',
    );
    expect(container.textContent).not.toContain('🧠');
  });

  it('leaves unrelated emoji unchanged', () => {
    const { container } = render(
      <MarkdownContent source='🎉 shipped today' />,
    );

    expect(container.textContent).toContain('🎉 shipped today');
    expect(
      container.querySelector('.markdown-icon'),
    ).not.toBeInTheDocument();
  });

  it('renders markdown images without a crop box', () => {
    const { container } = render(
      <MarkdownContent
        source='![Architecture diagram](/media/posts/diagram.png)'
      />,
    );

    const image = screen.getByRole('img', {
      name: 'Architecture diagram',
    });

    expect(container.querySelector('.article-figure')).not.toBeNull();
    expect(image).toHaveClass('article-content-image');
    expect(image).not.toHaveClass('object-cover');
    expect(container.querySelector('.aspect-\\[16\\/9\\]')).toBeNull();
  });

  it('renders a configured https image as a plain img', () => {
    render(
      <MarkdownContent
        source='![Site shot](https://gkablog.com/media/a.png)'
      />,
    );

    expect(
      screen.getByRole('img', { name: 'Site shot' }),
    ).toHaveAttribute('src', 'https://gkablog.com/media/a.png');
  });

  it('renders an unsupported https host without crashing', () => {
    render(
      <MarkdownContent
        source='![Remote](https://images.example/shot.png)'
      />,
    );

    expect(
      screen.getByRole('img', { name: 'Remote' }),
    ).toHaveAttribute('src', 'https://images.example/shot.png');
    expect(screen.getByRole('img', { name: 'Remote' }).tagName).toBe(
      'IMG',
    );
  });

  it('rejects unsafe image schemes', () => {
    render(
      <MarkdownContent
        source='![bad](javascript:alert(1))'
      />,
    );

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('rejects javascript links', () => {
    render(
      <MarkdownContent source='[bad](javascript:alert(1))' />,
    );

    expect(
      screen.queryByRole('link', { name: 'bad' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('bad')).toBeInTheDocument();
  });
});
