import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { articles } from '@/test/fixtures/articles';

describe('ArticleCard', () => {
  it('covers decorative article card images', () => {
    const { container } = render(
      <ArticleCard article={articles[0]} />,
    );

    expect(
      container.querySelector('.article-hero-image'),
    ).not.toBeNull();
    expect(
      screen.getByRole('img', {
        name: `Artwork for ${articles[0].title}`,
      }),
    ).toHaveClass('object-cover');
  });

  it('links to the article detail route', () => {
    render(<ArticleCard article={articles[0]} />);

    expect(
      screen.getByRole('link', { name: /RAG System/i }),
    ).toHaveAttribute('href', '/articles/personal-rag-vps');
  });
});
