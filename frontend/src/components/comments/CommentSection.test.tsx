import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CommentSection } from '@/components/comments/CommentSection';
import type { CommentItem } from '@/lib/api/comments';

const commentsState = vi.hoisted(() => ({
  items: [] as CommentItem[],
  deleteMock: vi.fn(),
}));

vi.mock('@/components/auth/AuthContext', () => ({
  useAuth: () => ({
    user: {
      isAuthenticated: true,
      username: 'reader905',
      email: 'reader905@example.com',
      isStaff: false,
      isSuperuser: false,
    },
    ready: true,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock('@/lib/api/comments', () => ({
  listArticleComments: async () => commentsState.items,
  listProjectComments: async () => commentsState.items,
  createArticleComment: vi.fn(),
  createProjectComment: vi.fn(),
  deleteComment: (...args: unknown[]) =>
    commentsState.deleteMock(...args),
}));

describe('CommentSection', () => {
  beforeEach(() => {
    commentsState.deleteMock.mockReset();
    commentsState.items = [
      {
        id: 1,
        author: 'reader905',
        body: 'Mine to remove',
        createdAt: '2026-09-05T12:00:00Z',
        status: 'approved',
        canDelete: true,
      },
      {
        id: 2,
        author: 'other',
        body: 'Someone else',
        createdAt: '2026-09-05T12:01:00Z',
        status: 'approved',
        canDelete: false,
      },
    ];
  });

  it('shows Delete only on deletable comments', async () => {
    render(<CommentSection kind='article' slug='note' />);
    expect(
      await screen.findByText('Mine to remove'),
    ).toBeInTheDocument();
    expect(screen.getByText('Someone else')).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: 'Delete' }),
    ).toHaveLength(1);
  });

  it('removes a comment after confirmed deletion', async () => {
    commentsState.deleteMock.mockResolvedValue(undefined);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();
    render(<CommentSection kind='article' slug='note' />);
    await screen.findByText('Mine to remove');
    await user.click(
      screen.getByRole('button', { name: 'Delete' }),
    );
    expect(commentsState.deleteMock).toHaveBeenCalledWith(1);
    expect(
      screen.queryByText('Mine to remove'),
    ).not.toBeInTheDocument();
    expect(screen.getByText('Someone else')).toBeInTheDocument();
  });
});
