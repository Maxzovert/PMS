import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { getMe, logout as apiLogout, ApiError } from '../api';
import {
  clearSessionToken,
  getSessionToken,
  setSessionToken,
} from './session';

const AuthContext = createContext(null);

/**
 * Session token stored in SecureStore; sent as Authorization: Bearer.
 * Web client keeps using httpOnly cookies.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  const refreshUser = useCallback(async (signal) => {
    const token = await getSessionToken();
    if (!token) {
      setUser(null);
      return null;
    }
    try {
      const result = await getMe({ signal });
      setUser(result.data?.user || null);
      return result.data?.user || null;
    } catch (err) {
      if (err?.name === 'AbortError') {
        throw err;
      }
      if (
        err instanceof ApiError &&
        (err.status === 401 || err.code === 'UNAUTHORIZED')
      ) {
        await clearSessionToken();
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

  const completeLogin = useCallback(async (nextUser, sessionToken) => {
    if (sessionToken) {
      await setSessionToken(sessionToken);
    }
    setUser(nextUser || null);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // still clear local session
    }
    await clearSessionToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      bootstrapping,
      refreshUser,
      completeLogin,
      signOut,
    }),
    [user, bootstrapping, refreshUser, completeLogin, signOut],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
