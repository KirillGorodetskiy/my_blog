import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from '@/components/layout/Footer';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/site';

describe('Footer', () => {
  it('keeps rooms and elsewhere in one compact bar', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    const rooms = within(footer).getByRole('navigation', {
      name: 'Rooms',
    });
    const elsewhere = within(footer).getByRole(
      'navigation',
      { name: 'Elsewhere' },
    );

    expect(rooms.compareDocumentPosition(elsewhere)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(footer.querySelectorAll('nav')).toHaveLength(2);
  });

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
