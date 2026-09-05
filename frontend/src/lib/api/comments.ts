import { fetchJson } from '@/lib/api/client';

export interface CommentItem {
  id: number;
  author: string;
  body: string;
  createdAt: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
}

export function listArticleComments(
  slug: string,
): Promise<CommentItem[]> {
  return fetchJson<CommentItem[]>(
    `/api/v1/articles/${slug}/comments/`,
  );
}

export function listProjectComments(
  slug: string,
): Promise<CommentItem[]> {
  return fetchJson<CommentItem[]>(
    `/api/v1/projects/${slug}/comments/`,
  );
}

export function createArticleComment(
  slug: string,
  body: string,
  website = '',
): Promise<CommentItem> {
  return fetchJson<CommentItem>(
    `/api/v1/articles/${slug}/comments/`,
    {
      method: 'POST',
      body: JSON.stringify({ body, website }),
    },
  );
}

export function createProjectComment(
  slug: string,
  body: string,
  website = '',
): Promise<CommentItem> {
  return fetchJson<CommentItem>(
    `/api/v1/projects/${slug}/comments/`,
    {
      method: 'POST',
      body: JSON.stringify({ body, website }),
    },
  );
}

export function deleteComment(id: number): Promise<void> {
  return fetchJson<void>(`/api/v1/comments/${id}/`, {
    method: 'DELETE',
  });
}
