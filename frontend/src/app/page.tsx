import { FeaturedArticles } from '@/components/home/FeaturedArticles';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { HomeHero } from '@/components/home/HomeHero';
import { listArticles } from '@/lib/api/articles';
import { listProjects } from '@/lib/api/projects';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [articles, projects] = await Promise.all([
    listArticles(),
    listProjects(),
  ]);

  return (
    <>
      <HomeHero />
      <FeaturedArticles articles={articles} />
      <FeaturedProjects projects={projects} />
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
