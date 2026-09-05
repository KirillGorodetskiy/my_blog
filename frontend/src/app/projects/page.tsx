import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProjectsBrowser } from '@/components/projects/ProjectsBrowser';
import { ProjectsHero } from '@/components/projects/ProjectsHero';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Building useful things with modern tools.',
  alternates: { canonical: '/projects' },
  openGraph: {
    title: 'Projects',
    description: 'Building useful things with modern tools.',
    url: '/projects',
    images: [{ url: '/images/projects-hero.jpg' }],
  },
};

export default function ProjectsPage() {
  return (
    <>
      <ProjectsHero />
      <Suspense>
        <ProjectsBrowser />
      </Suspense>
    </>
  );
}
