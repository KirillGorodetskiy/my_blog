export const roomPosition = {
  '/articles': -1,
  '/': 0,
  '/projects': 1,
} as const;

export type RoomPath = keyof typeof roomPosition;

export const HERO_SOURCES = {
  '/articles': '/images/articles-hero.jpg',
  '/': '/images/home-panorama.jpg',
  '/projects': '/images/projects-hero.jpg',
  '/about': '/images/about-hero.jpg',
} as const;

export function isAboutPath(pathname: string): boolean {
  return pathname === '/about' || pathname.startsWith('/about/');
}

export function isRoomPath(
  pathname: string,
): pathname is RoomPath {
  return pathname in roomPosition;
}

export function getRoomPosition(
  pathname: string,
): number | null {
  if (!isRoomPath(pathname)) {
    return null;
  }

  return roomPosition[pathname];
}

export function getRoomDifference(
  previousPath: string,
  currentPath: string,
): number {
  if (isAboutPath(previousPath) || isAboutPath(currentPath)) {
    return 0;
  }

  const previous = getRoomPosition(previousPath);
  const current = getRoomPosition(currentPath);

  if (previous === null || current === null) {
    return 0;
  }

  return current - previous;
}

export function getTravelSign(difference: number): number {
  if (difference === 0) {
    return 0;
  }

  return difference > 0 ? 1 : -1;
}

export function getLayerDistance(
  difference: number,
  layer: 'page' | 'hero' | 'text',
  compact: boolean,
  reduced: boolean,
): number {
  if (reduced || difference === 0) {
    return 0;
  }

  const sign = getTravelSign(difference);
  const far = Math.abs(difference) > 1;

  if (compact) {
    return sign * (far ? 50 : 40);
  }

  const distances = {
    page: far ? 160 : 130,
    hero: far ? 86 : 70,
    text: far ? 135 : 110,
  };

  return sign * distances[layer];
}

export function getAdjacentHeroSources(
  pathname: string,
): string[] {
  if (pathname === '/') {
    return [HERO_SOURCES['/articles'], HERO_SOURCES['/projects']];
  }

  if (pathname === '/articles' || pathname === '/projects') {
    return [HERO_SOURCES['/']];
  }

  return [];
}

export const ROOM_EASE = [0.22, 1, 0.36, 1] as const;

export function getTransitionDuration(
  reduced: boolean,
  compact: boolean,
): number {
  if (reduced) {
    return 0.18;
  }

  return compact ? 0.35 : 0.55;
}
