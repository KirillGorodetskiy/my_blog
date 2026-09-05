import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from '@/components/layout/Footer';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site';

describe('Footer', () => {
  it('shows copyright, rooms, rss, and contact', () => {
    render(<Footer />);

    const year = new Date().getFullYear();

    expect(
      screen.getByRole('contentinfo'),
    ).toHaveTextContent(`© ${year} ${SITE_NAME}`);
    expect(
      screen.getByRole('link', { name: 'Home' }),
    ).toHaveAttribute('href', '/');
    expect(
      screen.getByRole('link', { name: 'Articles' }),
    ).toHaveAttribute('href', '/articles');
    expect(
      screen.getByRole('link', { name: 'Projects' }),
    ).toHaveAttribute('href', '/projects');
    expect(
      screen.getByRole('link', { name: 'About' }),
    ).toHaveAttribute('href', '/about');
    expect(
      screen.getByRole('link', { name: 'RSS' }),
    ).toHaveAttribute('href', '/rss.xml');
    expect(
      screen.getByRole('link', { name: 'Get in touch' }),
    ).toHaveAttribute('href', `mailto:${CONTACT_EMAIL}`);
  });
});
