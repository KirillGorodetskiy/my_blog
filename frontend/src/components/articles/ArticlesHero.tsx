'use client';

import Image from 'next/image';
import {
  HeroArtwork,
  HeroCopy,
} from '@/components/transitions/HeroLayers';

export function ArticlesHero() {
  return (
    <section className='relative overflow-hidden bg-[#05090a]'>
      <HeroArtwork>
        <Image
          src='/images/articles-hero.jpg'
          alt={
            'A man reads in a dark wood library at night, ' +
            'with snow-capped mountains visible through a ' +
            'window.'
          }
          width={1024}
          height={341}
          unoptimized
          priority
          className='h-auto w-full'
        />
      </HeroArtwork>
      <div
        className={
          'absolute inset-0 bg-gradient-to-r from-[#05090a]/72 ' +
          'via-[#05090a]/28 to-transparent'
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
          'absolute inset-0 z-10 mx-auto flex max-w-6xl ' +
          'flex-col justify-end px-5 pb-12 pt-24 md:px-8'
        }
      >
        <h1
          className={
            'font-serif text-5xl tracking-tight text-[#edf3ef] ' +
            'md:text-6xl'
          }
        >
          Articles
        </h1>
        <p className='mt-4 max-w-lg text-lg text-[#c3d0ca]'>
          Ideas, notes and lessons from the journey.
        </p>
      </HeroCopy>
    </section>
  );
}
