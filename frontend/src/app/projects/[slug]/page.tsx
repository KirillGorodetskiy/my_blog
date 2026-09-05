import { notFound } from 'next/navigation';
import { ProjectDetail } from '@/components/project/ProjectDetail';
import { projects } from '@/data/projects';
import { getProject } from '@/lib/content';
import { projectMetadata } from '@/lib/metadata';

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<'/projects/[slug]'>) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return { title: 'Project' };
  }

  return projectMetadata(project);
}

export default async function ProjectDetailPage({
  params,
}: PageProps<'/projects/[slug]'>) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}
