export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/articles', label: 'Articles' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
];

export function isCurrentPath(
  pathname: string,
  href: string,
): boolean {
  if (href === '/') {
    return pathname === '/';
  }

  return (
    pathname === href || pathname.startsWith(`${href}/`)
  );
}
