import { describe, expect, it } from 'vitest';
import {
  getAdjacentHeroSources,
  getLayerDistance,
  getRoomDifference,
  getTravelSign,
  roomPosition,
} from '@/lib/room-navigation';

describe('roomPosition', () => {
  it('places the three rooms on one axis', () => {
    expect(roomPosition['/articles']).toBe(-1);
    expect(roomPosition['/']).toBe(0);
    expect(roomPosition['/projects']).toBe(1);
  });
});

describe('getRoomDifference', () => {
  it('moves left from shelter to library', () => {
    expect(getRoomDifference('/', '/articles')).toBe(-1);
  });

  it('moves right from shelter to workshop', () => {
    expect(getRoomDifference('/', '/projects')).toBe(1);
  });

  it('returns to the shelter from each wing', () => {
    expect(getRoomDifference('/articles', '/')).toBe(1);
    expect(getRoomDifference('/projects', '/')).toBe(-1);
  });

  it('uses a two-room span between the wings', () => {
    expect(getRoomDifference('/articles', '/projects')).toBe(2);
    expect(getRoomDifference('/projects', '/articles')).toBe(-2);
  });

  it('fades when about is involved', () => {
    expect(getRoomDifference('/', '/about')).toBe(0);
    expect(getRoomDifference('/about', '/projects')).toBe(0);
  });
});

describe('getTravelSign', () => {
  it('points toward projects when the difference is positive', () => {
    expect(getTravelSign(1)).toBe(1);
    expect(getTravelSign(2)).toBe(1);
  });

  it('points toward articles when the difference is negative', () => {
    expect(getTravelSign(-1)).toBe(-1);
    expect(getTravelSign(-2)).toBe(-1);
  });
});

describe('getLayerDistance', () => {
  it('keeps the hero slower than the page on desktop', () => {
    const page = getLayerDistance(1, 'page', false, false);
    const hero = getLayerDistance(1, 'hero', false, false);
    const text = getLayerDistance(1, 'text', false, false);

    expect(Math.abs(hero)).toBeLessThan(Math.abs(text));
    expect(Math.abs(text)).toBeLessThan(Math.abs(page));
    expect(page).toBe(130);
    expect(hero).toBe(70);
    expect(text).toBe(110);
  });

  it('travels farther between the two wings', () => {
    expect(
      Math.abs(getLayerDistance(2, 'page', false, false)),
    ).toBeGreaterThan(
      Math.abs(getLayerDistance(1, 'page', false, false)),
    );
  });

  it('uses a short shared offset on mobile', () => {
    expect(getLayerDistance(1, 'page', true, false)).toBe(40);
    expect(getLayerDistance(1, 'hero', true, false)).toBe(40);
  });

  it('disables translation when motion is reduced', () => {
    expect(getLayerDistance(-1, 'page', false, true)).toBe(0);
  });
});

describe('getAdjacentHeroSources', () => {
  it('preloads both wings from home', () => {
    expect(getAdjacentHeroSources('/')).toEqual([
      '/images/articles-hero.jpg',
      '/images/projects-hero.jpg',
    ]);
  });

  it('preloads the shelter from each wing', () => {
    expect(getAdjacentHeroSources('/articles')).toEqual([
      '/images/home-panorama.jpg',
    ]);
    expect(getAdjacentHeroSources('/projects')).toEqual([
      '/images/home-panorama.jpg',
    ]);
  });
});
