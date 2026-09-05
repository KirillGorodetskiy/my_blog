import { fetchJson } from '@/lib/api/client';

export interface AuthUser {
  isAuthenticated: boolean;
  username: string | null;
  email: string | null;
  isSuperuser: boolean;
}

export function fetchCurrentUser(): Promise<AuthUser> {
  return fetchJson<AuthUser>('/api/v1/auth/me/');
}

export function registerUser(input: {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}): Promise<AuthUser> {
  return fetchJson<AuthUser>('/api/v1/auth/register/', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function loginUser(input: {
  username: string;
  password: string;
}): Promise<AuthUser> {
  return fetchJson<AuthUser>('/api/v1/auth/login/', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function logoutUser(): Promise<void> {
  return fetchJson<void>('/api/v1/auth/logout/', {
    method: 'POST',
  });
}
