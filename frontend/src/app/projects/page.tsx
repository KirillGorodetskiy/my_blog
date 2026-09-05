import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProjectsBrowser } from '@/components/projects/ProjectsBrowser';
import { ProjectsHero } from '@/components/projects/ProjectsHero';
import { listProjects } from '@/lib/api/projects';

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

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const projects = await listProjects();

  return (
    <>
      <ProjectsHero />
      <Suspense>
        <ProjectsBrowser projects={projects} />
      </Suspense>
    </>
  );
}
