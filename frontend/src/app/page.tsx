import { FeaturedArticles } from '@/components/home/FeaturedArticles';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { HomeHero } from '@/components/home/HomeHero';

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <FeaturedArticles />
      <FeaturedProjects />
      <section className='px-5 py-20 text-center'>
        <blockquote className='mx-auto max-w-2xl'>
          <p
            className={
              'font-serif text-xl italic leading-relaxed ' +
              'text-[#d7e2dc] md:text-2xl'
            }
          >
            “A curious mind, a calm place, and the tools to
            build a better tomorrow.”
          </p>
          <p className='mt-4 text-sm tracking-wide text-[#91a09a]'>
            — Kirill
          </p>
        </blockquote>
      </section>
    </>
  );
}
