import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  listParkingLocations,
  createParkingLocation,
  ApiError,
} from '../api';
import { DecorMark, DecorWave, PageMotion } from '../components';
import findParking from '../assets/decor/states/find-parking-anywhere.png';

export function ParkingListPage() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    listParkingLocations({ signal: controller.signal })
      .then((result) => {
        setLocations(result.data?.locations || []);
      })
      .catch((err) => {
        if (err?.name === 'AbortError') {
          return;
        }
        setError(
          err instanceof ApiError ? err.message : 'Could not load parkings.',
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, []);

  async function startOnboarding() {
    setBusy(true);
    setError(null);
    try {
      const result = await createParkingLocation();
      const id = result.data?.location?.id;
      navigate(`/parking/${id}/onboarding`);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not start onboarding.',
      );
      setBusy(false);
    }
  }

  if (loading) {
    return <p className="font-ui text-muted">Loading your parkings…</p>;
  }

  return (
    <PageMotion>
      <DecorMark kind="star" data-motion="decor" className="mb-3 w-6 opacity-45" />
      <h1
        data-motion="title"
        className="font-brand text-3xl font-bold tracking-tight text-secondary"
      >
        Your parkings
      </h1>
      <p data-motion="body" className="mt-2 font-ui text-base text-muted">
        Register locations through a short guided onboarding. Drafts can be
        resumed anytime.
      </p>

      <div data-motion="form" className="mt-8 space-y-6">
        {locations.length === 0 ? (
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <img
              src={findParking}
              alt=""
              className="h-40 w-auto max-w-[16rem] object-contain"
            />
            <div>
              <h2 className="font-brand text-xl font-semibold text-secondary">
                Add your first parking
              </h2>
              <p className="mt-2 max-w-sm font-ui text-sm leading-relaxed text-muted">
                We will walk you through basics, location, space, and pricing —
                then you can submit for review.
              </p>
              <button
                type="button"
                disabled={busy}
                onClick={startOnboarding}
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 font-ui text-sm font-semibold text-white disabled:opacity-60"
              >
                {busy ? 'Starting…' : 'Start onboarding'}
              </button>
              <DecorWave kind="light" className="mt-4 max-w-[8rem] opacity-40" />
            </div>
          </div>
        ) : (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={startOnboarding}
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 font-ui text-sm font-semibold text-white disabled:opacity-60"
            >
              {busy ? 'Starting…' : 'Add another parking'}
            </button>

            <ul className="space-y-3">
              {locations.map((loc) => (
                <li
                  key={loc.id}
                  className="rounded-2xl border border-border/30 bg-surface-elevated px-4 py-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-brand text-lg font-semibold text-secondary">
                        {loc.name || 'Untitled draft'}
                      </p>
                      <p className="mt-1 font-ui text-sm text-muted">
                        Status: {loc.status.replace('_', ' ')}
                        {loc.status === 'draft'
                          ? ` · step ${loc.onboardingStep}/5`
                          : ''}
                      </p>
                    </div>
                    {loc.status === 'draft' ? (
                      <Link
                        to={`/parking/${loc.id}/onboarding`}
                        className="rounded-lg bg-secondary px-3 py-2 font-ui text-sm font-medium text-surface no-underline"
                      >
                        Continue
                      </Link>
                    ) : (
                      <span className="rounded-full bg-surface-muted px-3 py-1 font-ui text-xs font-medium text-secondary">
                        Under review
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {error ? (
          <p className="rounded-xl bg-accent-soft px-3 py-3 font-ui text-sm text-secondary-deep" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </PageMotion>
  );
}
