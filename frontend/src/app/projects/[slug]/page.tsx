import { notFound } from 'next/navigation';
import { CommentSection } from '@/components/comments/CommentSection';
import { ProjectDetail } from '@/components/project/ProjectDetail';
import { loadProject } from '@/lib/api/load';
import { listProjects } from '@/lib/api/projects';
import { getRelatedProjects } from '@/lib/content';
import { projectMetadata } from '@/lib/metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: PageProps<'/projects/[slug]'>) {
  const { slug } = await params;
  const project = await loadProject(slug);

  if (!project) {
    return { title: 'Project' };
  }

  return projectMetadata(project);
}

export default async function ProjectDetailPage({
  params,
}: PageProps<'/projects/[slug]'>) {
  const { slug } = await params;
  const project = await loadProject(slug);

  if (!project) {
    notFound();
  }

  const projects = await listProjects();
  const related = getRelatedProjects(project.slug, 3, projects);

  return (
    <>
      <ProjectDetail project={project} related={related} />
      <div className='project-shell'>
        <CommentSection kind='project' slug={project.slug} />
      </div>
    </>
  );
}
