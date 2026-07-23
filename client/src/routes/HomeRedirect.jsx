import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function HomeRedirect() {
  const { isAuthenticated, bootstrapping } = useAuth();

  if (bootstrapping) {
    return (
      <main className="layout__main">
        <p className="page__lead">Loading…</p>
      </main>
    );
  }

  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}
