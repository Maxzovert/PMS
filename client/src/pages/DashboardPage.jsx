import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHealth, listParkingLocations, ApiError } from '../api';
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
  const [parkingCount, setParkingCount] = useState(null);

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

    listParkingLocations({ signal: controller.signal })
      .then((result) => {
        setParkingCount((result.data?.locations || []).length);
      })
      .catch(() => {
        setParkingCount(null);
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
        Signed in as {user?.phone || 'owner'}.
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
              {parkingCount === 0
                ? 'No parking locations yet'
                : parkingCount
                  ? `${parkingCount} parking location${parkingCount === 1 ? '' : 's'}`
                  : 'Your parkings'}
            </h2>
            <p className="mt-1 max-w-sm font-ui text-sm leading-relaxed text-muted">
              {parkingCount === 0
                ? 'Start the guided onboarding to list your first location.'
                : 'Manage drafts and submissions from Parking.'}
            </p>
            <Link
              to="/parking"
              className="mt-4 inline-flex rounded-xl bg-primary px-4 py-2.5 font-ui text-sm font-semibold text-white no-underline"
            >
              {parkingCount === 0 ? 'Start onboarding' : 'Open parking'}
            </Link>
          </div>
        </section>
      </div>
    </PageMotion>
  );
}
