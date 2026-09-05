import Link from 'next/link';
import type { Project } from '@/data/projects';
import { ContentMedia } from '@/components/ui/ContentMedia';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article
      className={
        'overflow-hidden rounded-2xl border ' +
        'border-[#183032] bg-[#091112] transition-colors ' +
        'hover:border-[#245055] ' +
        'focus-within:outline-2 ' +
        'focus-within:outline-offset-4 ' +
        'focus-within:outline-[#61e6b3]'
      }
    >
      <Link
        href={`/projects/${project.slug}`}
        className='block'
      >
        <ContentMedia
          src={project.image}
          label={`Artwork for ${project.title}`}
          className='aspect-[16/10] w-full'
        />
        <div className='space-y-3 px-5 py-5'>
          <p
            className={
              'inline-flex rounded-full bg-[#173d33] ' +
              'px-2.5 py-1 text-xs tracking-wide ' +
              'text-[#61e6b3]'
            }
          >
            {project.category}
          </p>
          <h3
            className={
              'font-serif text-2xl leading-snug text-[#edf3ef]'
            }
          >
            {project.title}
          </h3>
          <p className='text-sm leading-relaxed text-[#91a09a]'>
            {project.description}
          </p>
        </div>
      </Link>
    </article>
  );
}
