import type { Project, ProjectList } from '@/data/types';
import { fetchJson } from '@/lib/api/client';

export function listProjects(): Promise<ProjectList[]> {
  return fetchJson<ProjectList[]>('/api/v1/projects/');
}

export function getProjectBySlug(
  slug: string,
): Promise<Project> {
  return fetchJson<Project>(`/api/v1/projects/${slug}/`);
}
