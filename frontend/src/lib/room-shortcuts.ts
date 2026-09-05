const TYPING_TARGETS = new Set([
  'INPUT',
  'TEXTAREA',
  'SELECT',
]);

export function isTypingTarget(
  target: EventTarget | null,
): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    TYPING_TARGETS.has(target.tagName) ||
    target.isContentEditable
  );
}

export function roomShortcutTarget(
  pathname: string,
  key: string,
  options: {
    typing?: boolean;
    modified?: boolean;
  } = {},
): string | null {
  if (options.typing || options.modified) {
    return null;
  }

  if (pathname === '/') {
    if (key === 'ArrowLeft') {
      return '/articles';
    }

    if (key === 'ArrowRight') {
      return '/projects';
    }
  }

  if (
    pathname === '/articles' ||
    pathname.startsWith('/articles/')
  ) {
    return key === 'ArrowRight' ? '/' : null;
  }

  if (
    pathname === '/projects' ||
    pathname.startsWith('/projects/')
  ) {
    return key === 'ArrowLeft' ? '/' : null;
  }

  return null;
}
