import { useEffect, useState } from 'react';
import { getHealth, ApiError } from '../api';
import { useAuth } from '../auth/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();
  const [health, setHealth] = useState({
    status: 'loading',
    message: 'Checking API…',
    detail: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    getHealth({ signal: controller.signal })
      .then((result) => {
        const database = result.data?.database;
        const dbLabel = database?.connected
          ? 'DB connected'
          : database?.configured
            ? 'DB not connected'
            : 'DB not configured';

        setHealth({
          status: 'ok',
          message: result.message || 'API reachable',
          detail: `${dbLabel} · ${result.requestId}`,
        });
      })
      .catch((err) => {
        if (err?.name === 'AbortError') {
          return;
        }
        const message =
          err instanceof ApiError ? err.message : 'Could not reach the API.';
        const detail =
          err instanceof ApiError && err.requestId
            ? `${err.code || 'ERROR'} · ${err.requestId}`
            : err instanceof ApiError
              ? err.code
              : null;

        setHealth({
          status: 'error',
          message,
          detail,
        });
      });

    return () => controller.abort();
  }, []);

  return (
    <section className="page page--dashboard">
      <h1 className="page__title">Dashboard</h1>
      <p className="page__lead">
        Signed in as {user?.phone || 'owner'}. Bookings and earnings come in
        later phases.
      </p>

      <section
        className={`app-health app-health--${health.status}`}
        aria-live="polite"
      >
        <p className="app-health__label">API status</p>
        <p className="app-health__message">{health.message}</p>
        {health.detail ? (
          <p className="app-health__detail">{health.detail}</p>
        ) : null}
      </section>
    </section>
  );
}
