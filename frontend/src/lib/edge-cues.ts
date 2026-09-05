export interface EdgeCueLink {
  href: string;
  label: string;
}

export interface EdgeCueSet {
  left: EdgeCueLink | null;
  right: EdgeCueLink | null;
}

export function edgeCuesFor(
  pathname: string,
): EdgeCueSet | null {
  if (pathname === '/') {
    return {
      left: { href: '/articles', label: '← Library' },
      right: { href: '/projects', label: 'Workshop →' },
    };
  }

  if (
    pathname === '/articles' ||
    pathname.startsWith('/articles/')
  ) {
    return {
      left: null,
      right: { href: '/', label: 'Shelter →' },
    };
  }

  if (
    pathname === '/projects' ||
    pathname.startsWith('/projects/')
  ) {
    return {
      left: { href: '/', label: '← Shelter' },
      right: null,
    };
  }

  return null;
}
