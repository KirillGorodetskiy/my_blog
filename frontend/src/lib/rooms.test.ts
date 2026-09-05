import { describe, expect, it } from 'vitest';
import {
  pathToRoom,
  roomIndex,
  transitionDirection,
} from '@/lib/rooms';

describe('pathToRoom', () => {
  it('maps the home path to the shelter', () => {
    expect(pathToRoom('/')).toBe('home');
  });

  it('maps article paths to the library wing', () => {
    expect(pathToRoom('/articles')).toBe('articles');
    expect(pathToRoom('/articles/extra')).toBe('articles');
  });

  it('maps project paths to the workshop wing', () => {
    expect(pathToRoom('/projects')).toBe('projects');
    expect(pathToRoom('/projects/extra')).toBe('projects');
  });

  it('maps the about path to the portrait room', () => {
    expect(pathToRoom('/about')).toBe('about');
  });
});

describe('roomIndex', () => {
  it('orders rooms from library to workshop', () => {
    expect(roomIndex('articles')).toBe(0);
    expect(roomIndex('home')).toBe(1);
    expect(roomIndex('projects')).toBe(2);
  });
});

describe('transitionDirection', () => {
  it('moves left from shelter to library', () => {
    expect(transitionDirection('home', 'articles')).toBe(-1);
  });

  it('moves right from shelter to workshop', () => {
    expect(transitionDirection('home', 'projects')).toBe(1);
  });

  it('returns to the shelter from each wing', () => {
    expect(transitionDirection('articles', 'home')).toBe(1);
    expect(transitionDirection('projects', 'home')).toBe(-1);
  });

  it('stays still when the room does not change', () => {
    expect(transitionDirection('home', 'home')).toBe(0);
  });

  it('fades when entering or leaving about', () => {
    expect(transitionDirection('home', 'about')).toBe(0);
    expect(transitionDirection('about', 'articles')).toBe(0);
  });
});
