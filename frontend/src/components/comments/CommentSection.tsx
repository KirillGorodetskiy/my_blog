'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { ApiError } from '@/lib/api/client';
import {
  createArticleComment,
  createProjectComment,
  deleteComment,
  listArticleComments,
  listProjectComments,
  type CommentItem,
} from '@/lib/api/comments';

interface CommentSectionProps {
  kind: 'article' | 'project';
  slug: string;
}

type LoadState = 'loading' | 'loaded' | 'error';

export function CommentSection({
  kind,
  slug,
}: CommentSectionProps) {
  const { user, ready } = useAuth();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loadState, setLoadState] = useState<LoadState>(
    'loading',
  );
  const [retryTick, setRetryTick] = useState(0);
  const [body, setBody] = useState('');
  const [website, setWebsite] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loader =
      kind === 'article'
        ? listArticleComments
        : listProjectComments;
    let cancelled = false;

    loader(slug)
      .then((items) => {
        if (cancelled) {
          return;
        }

        setComments(items);
        setLoadState('loaded');
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setComments([]);
        setLoadState('error');
      });

    return () => {
      cancelled = true;
    };
  }, [kind, slug, retryTick, user.isAuthenticated, user.username]);

  function retryLoad() {
    setLoadState('loading');
    setRetryTick((value) => value + 1);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setNotice('');

    try {
      const created =
        kind === 'article'
          ? await createArticleComment(slug, body, website)
          : await createProjectComment(slug, body, website);

      setBody('');
      if (created.status === 'approved') {
        setComments((current) => [...current, created]);
        setNotice('Comment published.');
      } else {
        setNotice(
          'Comment submitted for review. It will appear after approval.',
        );
      }
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Could not submit the comment.',
      );
    }
  }

  async function onDelete(comment: CommentItem) {
    const confirmed = window.confirm(
      'Delete this comment?',
    );
    if (!confirmed) {
      return;
    }
    setError('');
    try {
      await deleteComment(comment.id);
      setComments((current) =>
        current.filter((item) => item.id !== comment.id),
      );
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Could not delete the comment.',
      );
    }
  }

  return (
    <section className='comment-block'>
      <h2 className='comment-title'>Comments</h2>
      {loadState === 'loading' ? (
        <p className='comment-empty'>Loading comments.</p>
      ) : null}
      {loadState === 'error' ? (
        <p className='comment-empty'>
          Could not load comments.{' '}
          <button
            type='button'
            className='article-link'
            onClick={retryLoad}
          >
            Retry
          </button>
        </p>
      ) : null}
      {loadState === 'loaded' && comments.length === 0 ? (
        <p className='comment-empty'>No comments yet.</p>
      ) : null}
      {loadState === 'loaded' && comments.length > 0 ? (
        <ul className='comment-list'>
          {comments.map((comment) => (
            <li key={comment.id} className='comment-item'>
              <p className='comment-meta'>
                <span>{comment.author}</span>
                {comment.createdAt ? (
                  <time dateTime={comment.createdAt}>
                    {new Date(
                      comment.createdAt,
                    ).toLocaleString()}
                  </time>
                ) : null}
              </p>
              <p className='comment-body'>{comment.body}</p>
              {comment.canDelete ? (
                <button
                  type='button'
                  className='auth-link comment-delete'
                  onClick={() => {
                    void onDelete(comment);
                  }}
                >
                  Delete
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
      {!ready ? null : user.isAuthenticated ? (
        <form className='comment-form' onSubmit={onSubmit}>
          <label className='auth-label'>
            Add a comment
            <textarea
              className='auth-input comment-input'
              value={body}
              onChange={(event) => setBody(event.target.value)}
              minLength={3}
              maxLength={3000}
              required
            />
          </label>
          <input
            className='comment-honeypot'
            tabIndex={-1}
            autoComplete='off'
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            aria-hidden='true'
          />
          {notice ? <p className='comment-notice'>{notice}</p> : null}
          {error ? <p className='auth-error'>{error}</p> : null}
          <button type='submit' className='auth-submit'>
            Post comment
          </button>
        </form>
      ) : (
        <p className='comment-empty'>
          <Link href='/login' className='article-link'>
            Sign in to comment
          </Link>
        </p>
      )}
    </section>
  );
}
