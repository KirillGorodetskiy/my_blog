'use client';

import { Button } from '@/components/ui/Button';
import { SceneHeroArt } from '@/components/hero/SceneHeroArt';
import {
  HeroArtwork,
  HeroCopy,
} from '@/components/transitions/HeroLayers';

export function HomeHero() {
  return (
    <section
      className={
        'home-hero scene-hero relative overflow-hidden ' +
        'bg-[#05090a]'
      }
    >
      <div className='scene-hero-art-wrap'>
        <HeroArtwork>
          <SceneHeroArt
            src='/images/home-panorama.jpg'
            alt={
              'A mountain shelter at night: library on the ' +
              'left, a man at a desk in the center, and a ' +
              'workshop on the right, with a lake, moon, ' +
              'and Milky Way outside.'
            }
          />
        </HeroArtwork>
      </div>
      <div
        className={
          'absolute inset-0 bg-gradient-to-r from-[#05090a]/78 ' +
          'via-[#05090a]/22 to-transparent'
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
          'home-hero-copy scene-hero-copy absolute inset-0 ' +
          'z-10 mx-auto ' +
          'flex max-w-6xl flex-col justify-center px-5 ' +
          'pb-12 pt-20 md:px-8'
        }
      >
        <div className='max-w-xl'>
          <h1
            className={
              'home-hero-title font-medium leading-[1.08] ' +
              'tracking-tight text-[#edf3ef]'
            }
          >
            <span className='home-hero-lead'>A calmer way</span>
            {' '}
            <span className='home-hero-rest'>
              to explore technology
            </span>
          </h1>
          <p
            className={
              'mt-5 max-w-md text-base leading-relaxed ' +
              'text-[#c3d0ca] sm:text-lg'
            }
          >
            Notes, projects and ideas from a curious mind.
          </p>
          <div
            className={
              'hero-room-actions mt-8 flex flex-wrap gap-3'
            }
          >
            <Button href='/articles'>Explore articles</Button>
            <Button
              href='/projects'
              variant='ghost'
              className='hero-secondary-cta'
            >
              View projects
            </Button>
          </div>
        </div>
      </HeroCopy>
    </section>
  );
}
