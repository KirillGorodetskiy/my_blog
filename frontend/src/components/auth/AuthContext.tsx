'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  type AuthUser,
} from '@/lib/api/auth';

const anonymous: AuthUser = {
  isAuthenticated: false,
  username: null,
  email: null,
  isSuperuser: false,
};

interface AuthContextValue {
  user: AuthUser;
  ready: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (input: {
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(
  null,
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser>(anonymous);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetchCurrentUser()
      .then(setUser)
      .catch(() => setUser(anonymous))
      .finally(() => setReady(true));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      async login(username, password) {
        setUser(await loginUser({ username, password }));
      },
      async register(input) {
        setUser(await registerUser(input));
      },
      async logout() {
        await logoutUser();
        setUser(anonymous);
      },
    }),
    [user, ready],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth requires AuthProvider');
  }

  return context;
}
