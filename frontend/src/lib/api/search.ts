import { fetchJson } from '@/lib/api/client';

export interface SearchArticleHit {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
}

export interface SearchProjectHit {
  slug: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
}

export interface SearchResponse {
  articles: SearchArticleHit[];
  projects: SearchProjectHit[];
}

export function searchContent(
  query: string,
): Promise<SearchResponse> {
  const params = new URLSearchParams({ q: query });
  return fetchJson<SearchResponse>(
    `/api/v1/search/?${params.toString()}`,
  );
}
