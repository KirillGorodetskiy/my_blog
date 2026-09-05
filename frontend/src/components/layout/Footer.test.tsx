import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from '@/components/layout/Footer';
import { CONTACT_EMAIL } from '@/lib/site';

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

    const brand = footer.querySelector('.brand');
    expect(brand).not.toBeNull();
    expect(elsewhere.compareDocumentPosition(brand!)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it('shows the KIRILL lockup with the two-line slogan', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    const brand = footer.querySelector('.brand');

    expect(brand).not.toBeNull();
    expect(brand?.querySelector('.brand-name')).toHaveTextContent(
      'KIRILL',
    );
    expect(brand?.textContent).toContain(`© ${new Date().getFullYear()}`);
    expect(footer).toHaveTextContent('INSPIRED BY ME');
    expect(footer).toHaveTextContent('BUILT WITH AI');
    expect(footer.textContent).not.toMatch(/INSPIRED BY ME[.,]/);
    expect(footer.textContent).not.toMatch(/BUILT WITH AI[.,]/);
    expect(footer.textContent?.match(/KIRILL/g)).toHaveLength(1);
  });

  it('shows copyright, rooms, rss, and contact', () => {
    render(<Footer />);

    const year = new Date().getFullYear();

    expect(
      screen.getByRole('contentinfo'),
    ).toHaveTextContent(`© ${year}`);
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
