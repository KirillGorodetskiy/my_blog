export type RoomId =
  | 'articles'
  | 'home'
  | 'projects'
  | 'about';

export const ROOM_ORDER: RoomId[] = [
  'articles',
  'home',
  'projects',
];

export function pathToRoom(pathname: string): RoomId {
  if (pathname === '/articles' || pathname.startsWith('/articles/')) {
    return 'articles';
  }

  if (pathname === '/projects' || pathname.startsWith('/projects/')) {
    return 'projects';
  }

  if (pathname === '/about' || pathname.startsWith('/about/')) {
    return 'about';
  }

  return 'home';
}

export function roomIndex(room: RoomId): number {
  return ROOM_ORDER.indexOf(room);
}

export function transitionDirection(
  from: RoomId,
  to: RoomId,
): number {
  if (from === 'about' || to === 'about') {
    return 0;
  }

  return roomIndex(to) - roomIndex(from);
}
