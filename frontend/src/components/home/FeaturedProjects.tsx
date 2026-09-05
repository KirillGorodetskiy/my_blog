import { featuredItems } from '@/lib/filters';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { ProjectList } from '@/data/types';

export function FeaturedProjects({
  projects,
}: {
  projects: ProjectList[];
}) {
  const featured = featuredItems(projects, 3);

  return (
    <section className='mx-auto max-w-6xl px-5 pb-8 md:px-8'>
      <SectionHeading
        title='Featured Projects'
        href='/projects'
        linkLabel='View all →'
      />
      <div className='grid gap-6 md:grid-cols-3'>
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
