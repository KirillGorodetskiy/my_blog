'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';

export function AuthControls({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { user, ready, logout } = useAuth();

  if (!ready) {
    return null;
  }

  if (!user.isAuthenticated) {
    return (
      <div className='flex items-center gap-3'>
        <Link href='/login' className='auth-link'>
          Sign in
        </Link>
        {compact ? null : (
          <Link href='/register' className='auth-link'>
            Register
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className='flex items-center gap-3'>
      <span className='auth-user'>{user.username}</span>
      <button
        type='button'
        className='auth-link'
        onClick={() => {
          void logout();
        }}
      >
        Logout
      </button>
    </div>
  );
}
