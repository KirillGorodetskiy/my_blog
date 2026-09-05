'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { ApiError } from '@/lib/api/client';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    try {
      await login(username, password);
      router.push('/');
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Could not sign in.',
      );
    }
  }

  return (
    <section className='auth-page'>
      <h1 className='auth-title'>Sign in</h1>
      <p className='auth-copy'>
        Use your account to comment on articles and projects.
      </p>
      <form className='auth-form' onSubmit={onSubmit}>
        <label className='auth-label'>
          Username
          <input
            className='auth-input'
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete='username'
            required
          />
        </label>
        <label className='auth-label'>
          Password
          <input
            className='auth-input'
            type='password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete='current-password'
            required
          />
        </label>
        {error ? <p className='auth-error'>{error}</p> : null}
        <button type='submit' className='auth-submit'>
          Sign in
        </button>
      </form>
      <p className='auth-copy'>
        New here?{' '}
        <Link href='/register' className='article-link'>
          Create an account
        </Link>
      </p>
    </section>
  );
}
