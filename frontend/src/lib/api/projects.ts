import type { Project } from '@/data/types';
import { fetchJson } from '@/lib/api/client';

export function listProjects(): Promise<Project[]> {
  return fetchJson<Project[]>('/api/v1/projects/');
}

export function getProjectBySlug(
  slug: string,
): Promise<Project> {
  return fetchJson<Project>(`/api/v1/projects/${slug}/`);
}
