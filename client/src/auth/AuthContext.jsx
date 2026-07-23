import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getMe, logout as apiLogout, ApiError } from '../api';

const AuthContext = createContext(null);

/**
 * Session is server httpOnly cookie. Client mirrors user from GET /auth/me.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  const refreshUser = useCallback(async (signal) => {
    try {
      const result = await getMe({ signal });
      setUser(result.data?.user || null);
      return result.data?.user || null;
    } catch (err) {
      if (err?.name === 'AbortError') {
        throw err;
      }
      if (err instanceof ApiError && (err.status === 401 || err.code === 'UNAUTHORIZED')) {
        setUser(null);
        return null;
      }
      throw err;
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    refreshUser(controller.signal)
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setBootstrapping(false);
        }
      });

    return () => controller.abort();
  }, [refreshUser]);

  const setSessionUser = useCallback((nextUser) => {
    setUser(nextUser);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // still clear local mirror
    }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      bootstrapping,
      refreshUser,
      setSessionUser,
      signOut,
      isStub: false,
    }),
    [user, bootstrapping, refreshUser, setSessionUser, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
