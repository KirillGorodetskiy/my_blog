'use client';

import { SceneHeroArt } from '@/components/hero/SceneHeroArt';
import {
  HeroArtwork,
  HeroCopy,
} from '@/components/transitions/HeroLayers';

export function AboutHero() {
  return (
    <section
      className='scene-hero relative overflow-hidden bg-[#05090a]'
    >
      <div className='scene-hero-art-wrap'>
        <HeroArtwork>
          <SceneHeroArt
            src='/images/about-hero.jpg'
            alt={
              'Night view from a mountain shelter. A man ' +
              'with glasses sits under a blanket and looks ' +
              'out over a dark lake, moon, and Milky Way.'
            }
          />
        </HeroArtwork>
      </div>
      <div
        className={
          'absolute inset-0 bg-gradient-to-r from-[#05090a]/86 ' +
          'via-[#05090a]/40 to-transparent'
        }
      />
      <div
        className={
          'absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t ' +
          'from-[#05090a] to-transparent'
        }
      />
      <HeroCopy
        className={
          'scene-hero-copy absolute inset-0 z-10 mx-auto ' +
          'flex max-w-6xl flex-col justify-end px-5 pb-12 ' +
          'pt-24 md:px-8'
        }
      >
        <h1
          className={
            'scene-hero-title font-serif tracking-tight ' +
            'text-[#edf3ef]'
          }
        >
          About
        </h1>
        <p className='mt-4 max-w-lg text-lg text-[#c3d0ca]'>
          A quieter room for thinking, building, and writing.
        </p>
      </HeroCopy>
    </section>
  );
}
