import { useEffect, useState } from 'react';
import { getHealth, ApiError } from '../api';
import { useAuth } from '../auth/AuthContext';
import noResult from '../assets/decor/states/no-result-found.svg';
import { DecorMark, PageMotion } from '../components';

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

  const healthTone =
    health.status === 'ok'
      ? 'border-primary/35 bg-surface-muted'
      : health.status === 'error'
        ? 'border-border/50 bg-accent-soft'
        : 'border-border/40 bg-surface-elevated';

  return (
    <PageMotion>
      <DecorMark
        kind="star"
        data-motion="decor"
        className="mb-3 w-6 opacity-45"
      />
      <h1
        data-motion="title"
        className="font-brand text-3xl font-bold tracking-tight text-secondary"
      >
        Dashboard
      </h1>
      <p data-motion="body" className="mt-2 font-ui text-base text-muted">
        Signed in as {user?.phone || 'owner'}. Bookings and earnings come in
        later phases.
      </p>

      <div data-motion="form" className="mt-8 space-y-8">
        <section
          className={`rounded-2xl border px-4 py-3.5 ${healthTone}`}
          aria-live="polite"
        >
          <p className="font-ui text-xs font-medium uppercase tracking-[0.08em] text-muted">
            API status
          </p>
          <p className="mt-1 font-ui text-sm font-medium text-secondary">
            {health.message}
          </p>
          {health.detail ? (
            <p className="mt-1 break-all font-ui text-xs text-muted">
              {health.detail}
            </p>
          ) : null}
        </section>

        <section className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <img
            src={noResult}
            alt=""
            className="h-36 w-auto max-w-[14rem] object-contain opacity-90"
          />
          <div>
            <h2 className="font-brand text-xl font-semibold text-secondary">
              No parking locations yet
            </h2>
            <p className="mt-1 max-w-sm font-ui text-sm leading-relaxed text-muted">
              Parking registration comes next. When you add a location, it will
              show up here.
            </p>
          </div>
        </section>
      </div>
    </PageMotion>
  );
}
