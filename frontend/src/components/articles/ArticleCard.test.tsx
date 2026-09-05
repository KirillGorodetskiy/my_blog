import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { articles } from '@/data/articles';

describe('ArticleCard', () => {
  it('links to the article detail route', () => {
    render(<ArticleCard article={articles[0]} />);

    expect(
      screen.getByRole('link', { name: /RAG System/i }),
    ).toHaveAttribute('href', '/articles/personal-rag-vps');
  });
});
