'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { TurnstileWidget } from '@/components/auth/TurnstileWidget';
import { ApiError } from '@/lib/api/client';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    try {
      await register({
        username,
        email,
        password,
        passwordConfirm,
        turnstileToken,
      });
      router.push('/');
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : 'Could not create the account.',
      );
    }
  }

  return (
    <section className='auth-page'>
      <h1 className='auth-title'>Register</h1>
      <p className='auth-copy'>
        Create an account to leave comments.
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
          Email
          <input
            className='auth-input'
            type='email'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete='email'
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
            autoComplete='new-password'
            required
          />
        </label>
        <label className='auth-label'>
          Confirm password
          <input
            className='auth-input'
            type='password'
            value={passwordConfirm}
            onChange={(event) =>
              setPasswordConfirm(event.target.value)
            }
            autoComplete='new-password'
            required
          />
        </label>
        <TurnstileWidget onToken={setTurnstileToken} />
        {error ? <p className='auth-error'>{error}</p> : null}
        <button type='submit' className='auth-submit'>
          Create account
        </button>
      </form>
      <p className='auth-copy'>
        Already registered?{' '}
        <Link href='/login' className='article-link'>
          Sign in
        </Link>
      </p>
    </section>
  );
}
