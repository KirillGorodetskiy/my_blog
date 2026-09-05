import type { Metadata } from 'next';
import { AboutHero } from '@/components/about/AboutHero';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'About',
  description:
    'A quieter room for thinking, building, and writing.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About',
    description:
      'A quieter room for thinking, building, and writing.',
    url: '/about',
    images: [{ url: '/images/about-hero.jpg' }],
  },
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <section className='about-page'>
        <h2 className='about-heading'>Introduction</h2>
        <p className='about-copy'>
          I write about software, automation, and the systems
          that help a curious mind stay calm enough to build.
        </p>
        <h2 className='about-heading'>Background</h2>
        <p className='about-copy'>
          This site is one connected place: notes in the
          library, experiments in the workshop, and a shelter
          in between. The longer biography is still short on
          purpose.
        </p>
        <h2 className='about-heading'>Current interests</h2>
        <p className='about-copy'>
          Quiet automation, personal retrieval, and interfaces
          that stay out of the way. I care more about durable
          tools than loud demos.
        </p>
        <h2 className='about-heading'>Technical focus</h2>
        <p className='about-copy'>
          Practical systems work: small services, careful
          front-ends, and the boring reliability that lets
          writing continue.
        </p>
        <h2 className='about-heading'>Direction</h2>
        <p className='about-copy'>
          The public work right now is this rebuild — a calmer
          front-end over the existing Django core — plus the
          notes and projects already on the map.
        </p>
        <div className='mt-10'>
          <Button
            href='mailto:hello@gkablog.com'
            variant='outline'
          >
            Get in touch
          </Button>
        </div>
      </section>
    </>
  );
}
