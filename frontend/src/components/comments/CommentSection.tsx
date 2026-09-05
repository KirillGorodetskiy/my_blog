'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { ApiError } from '@/lib/api/client';
import {
  createArticleComment,
  createProjectComment,
  listArticleComments,
  listProjectComments,
  type CommentItem,
} from '@/lib/api/comments';

interface CommentSectionProps {
  kind: 'article' | 'project';
  slug: string;
}

export function CommentSection({
  kind,
  slug,
}: CommentSectionProps) {
  const { user, ready } = useAuth();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [body, setBody] = useState('');
  const [website, setWebsite] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loader =
      kind === 'article'
        ? listArticleComments
        : listProjectComments;

    loader(slug)
      .then(setComments)
      .catch(() => setComments([]));
  }, [kind, slug]);

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

  return (
    <section className='comment-block'>
      <h2 className='comment-title'>Comments</h2>
      {comments.length === 0 ? (
        <p className='comment-empty'>No comments yet.</p>
      ) : (
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
            </li>
          ))}
        </ul>
      )}
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
