'use client';

import Image from 'next/image';
import {
  HeroArtwork,
  HeroCopy,
} from '@/components/transitions/HeroLayers';

export function ProjectsHero() {
  return (
    <section
      className='scene-hero relative overflow-hidden bg-[#05090a]'
    >
      <div className='scene-hero-art-wrap'>
        <HeroArtwork>
          <Image
            src='/images/projects-hero.jpg'
            alt={
              'A man works at a night workshop desk with a ' +
              'laptop, a robotic arm, and a glowing model, ' +
              'mountains visible through the windows.'
            }
            width={1024}
            height={438}
            unoptimized
            priority
            className='scene-hero-art h-auto w-full'
          />
        </HeroArtwork>
      </div>
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
          'scene-hero-copy absolute inset-0 z-10 mx-auto ' +
          'flex max-w-6xl flex-col justify-end px-5 pb-12 ' +
          'pt-24 md:px-8'
        }
      >
        <h1
          className={
            'font-serif text-5xl tracking-tight text-[#edf3ef] ' +
            'md:text-6xl'
          }
        >
          Projects
        </h1>
        <p className='mt-4 max-w-lg text-lg text-[#c3d0ca]'>
          Building useful things with modern tools.
        </p>
      </HeroCopy>
    </section>
  );
}
