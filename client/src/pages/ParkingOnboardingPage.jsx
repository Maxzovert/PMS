import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  getParkingLocation,
  updateParkingLocation,
  submitParkingLocation,
  ApiError,
} from '../api';
import { DecorMark, DecorWave, PageMotion } from '../components';
import {
  ONBOARDING_STEPS,
  LOCATION_TYPES,
  VEHICLE_OPTIONS,
  emptyParkingForm,
  locationToForm,
  buildStepPayload,
} from '../modules/parking/onboarding';
import findParking from '../assets/decor/states/find-parking-anywhere.png';

const inputClass =
  'mt-1.5 w-full rounded-xl border border-border/50 bg-surface-elevated px-3.5 py-2.5 font-ui text-base text-secondary outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:opacity-60';

export function ParkingOnboardingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(emptyParkingForm());
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    getParkingLocation(id, { signal: controller.signal })
      .then((result) => {
        const location = result.data?.location;
        if (!location) {
          setError('Parking not found.');
          return;
        }
        if (location.status !== 'draft') {
          navigate('/parking', { replace: true });
          return;
        }
        setForm(locationToForm(location));
        setStatus(location.status);
        setStep(Math.min(5, Math.max(0, location.onboardingStep || 0)));
      })
      .catch((err) => {
        if (err?.name === 'AbortError') {
          return;
        }
        setError(
          err instanceof ApiError ? err.message : 'Could not load draft.',
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [id, navigate]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleVehicle(value) {
    setForm((prev) => {
      const has = prev.vehicleTypes.includes(value);
      return {
        ...prev,
        vehicleTypes: has
          ? prev.vehicleTypes.filter((v) => v !== value)
          : [...prev.vehicleTypes, value],
      };
    });
  }

  async function saveAndGo(nextStep) {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const payload = buildStepPayload(form, nextStep);
      const result = await updateParkingLocation(id, payload);
      const location = result.data?.location;
      setForm(locationToForm(location));
      setStatus(location.status);
      setStep(nextStep);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save.');
    } finally {
      setBusy(false);
    }
  }

  async function handleSubmit() {
    setBusy(true);
    setError(null);
    try {
      await updateParkingLocation(id, buildStepPayload(form, 5));
      await submitParkingLocation(id);
      setMessage('Submitted for review.');
      navigate('/parking', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not submit.');
      setBusy(false);
    }
  }

  if (loading) {
    return <p className="font-ui text-muted">Loading onboarding…</p>;
  }

  const progress = ((step + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -top-6 right-0 opacity-30"
        aria-hidden
      >
        <DecorMark kind="star" className="w-8" />
      </div>

      <div className="mb-6 flex items-center justify-between gap-3">
        <Link
          to="/parking"
          className="font-ui text-sm font-medium text-secondary no-underline"
        >
          ← All parkings
        </Link>
        <span className="font-ui text-xs font-medium uppercase tracking-wider text-muted">
          {status}
        </span>
      </div>

      <div className="mb-8">
        <div className="mb-2 flex justify-between font-ui text-xs text-muted">
          <span>
            Step {step + 1} of {ONBOARDING_STEPS.length}
          </span>
          <span>{ONBOARDING_STEPS[step]?.label}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {ONBOARDING_STEPS.map((s) => (
            <span
              key={s.key}
              className={[
                'rounded-full px-2.5 py-1 font-ui text-[11px] font-medium',
                s.index === step
                  ? 'bg-primary text-white'
                  : s.index < step
                    ? 'bg-surface-muted text-secondary'
                    : 'bg-transparent text-muted',
              ].join(' ')}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      <PageMotion replayKey={step} className="min-h-[20rem]">
        {step === 0 ? (
          <div data-motion="form" className="grid gap-8 md:grid-cols-[1fr_0.9fr] md:items-center">
            <div>
              <DecorMark kind="illusOne" data-motion="decor" className="mb-4 w-16 opacity-60" />
              <h1
                data-motion="title"
                className="font-brand text-3xl font-bold text-secondary md:text-4xl"
              >
                Let’s list your parking
              </h1>
              <p data-motion="body" className="mt-3 max-w-md font-ui text-base leading-relaxed text-muted">
                A short guided setup. You can save and come back — nothing goes
                live until you submit for review.
              </p>
              <DecorWave kind="light" className="mt-5 max-w-[10rem] opacity-45" />
              <button
                type="button"
                disabled={busy}
                onClick={() => saveAndGo(1)}
                className="mt-8 inline-flex rounded-xl bg-primary px-6 py-3.5 font-ui text-sm font-semibold text-white disabled:opacity-60"
              >
                {busy ? 'Saving…' : 'Begin setup'}
              </button>
            </div>
            <img
              data-motion="decor"
              src={findParking}
              alt=""
              className="mx-auto max-h-56 w-full max-w-sm object-contain opacity-95"
            />
          </div>
        ) : null}

        {step === 1 ? (
          <div data-motion="form" className="max-w-lg space-y-5">
            <h1 data-motion="title" className="font-brand text-3xl font-bold text-secondary">
              Basics
            </h1>
            <p data-motion="body" className="font-ui text-muted">
              Give your location a clear name drivers will recognize.
            </p>
            <label className="block font-ui text-sm font-medium text-secondary">
              Parking name
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                disabled={busy}
                placeholder="e.g. Green Lane Covered Lot"
              />
            </label>
            <label className="block font-ui text-sm font-medium text-secondary">
              Location type
              <select
                className={inputClass}
                value={form.locationType}
                onChange={(e) => updateField('locationType', e.target.value)}
                disabled={busy}
              >
                <option value="">Select type</option>
                {LOCATION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
            <StepNav
              busy={busy}
              onBack={() => setStep(0)}
              onNext={() => saveAndGo(2)}
            />
          </div>
        ) : null}

        {step === 2 ? (
          <div data-motion="form" className="max-w-lg space-y-5">
            <h1 data-motion="title" className="font-brand text-3xl font-bold text-secondary">
              Location
            </h1>
            <p data-motion="body" className="font-ui text-muted">
              Address and optional coordinates (map pin comes later).
            </p>
            <label className="block font-ui text-sm font-medium text-secondary">
              Address
              <input
                className={inputClass}
                value={form.addressLine1}
                onChange={(e) => updateField('addressLine1', e.target.value)}
                disabled={busy}
              />
            </label>
            <label className="block font-ui text-sm font-medium text-secondary">
              Landmark
              <input
                className={inputClass}
                value={form.landmark}
                onChange={(e) => updateField('landmark', e.target.value)}
                disabled={busy}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block font-ui text-sm font-medium text-secondary">
                Latitude
                <input
                  className={inputClass}
                  value={form.latitude}
                  onChange={(e) => updateField('latitude', e.target.value)}
                  disabled={busy}
                  inputMode="decimal"
                  placeholder="28.61"
                />
              </label>
              <label className="block font-ui text-sm font-medium text-secondary">
                Longitude
                <input
                  className={inputClass}
                  value={form.longitude}
                  onChange={(e) => updateField('longitude', e.target.value)}
                  disabled={busy}
                  inputMode="decimal"
                  placeholder="77.20"
                />
              </label>
            </div>
            <StepNav
              busy={busy}
              onBack={() => setStep(1)}
              onNext={() => saveAndGo(3)}
            />
          </div>
        ) : null}

        {step === 3 ? (
          <div data-motion="form" className="max-w-lg space-y-5">
            <h1 data-motion="title" className="font-brand text-3xl font-bold text-secondary">
              Space & vehicles
            </h1>
            <p data-motion="body" className="font-ui text-muted">
              How many spots, and what fits.
            </p>
            <label className="block font-ui text-sm font-medium text-secondary">
              Capacity (spots)
              <input
                className={inputClass}
                value={form.capacity}
                onChange={(e) => updateField('capacity', e.target.value)}
                disabled={busy}
                inputMode="numeric"
              />
            </label>
            <label className="flex items-center gap-3 font-ui text-sm font-medium text-secondary">
              <input
                type="checkbox"
                checked={form.covered}
                onChange={(e) => updateField('covered', e.target.checked)}
                disabled={busy}
                className="size-4 accent-primary"
              />
              Covered parking
            </label>
            <fieldset>
              <legend className="font-ui text-sm font-medium text-secondary">
                Vehicle types
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {VEHICLE_OPTIONS.map((opt) => {
                  const active = form.vehicleTypes.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={busy}
                      onClick={() => toggleVehicle(opt.value)}
                      className={[
                        'rounded-full px-3.5 py-2 font-ui text-sm font-medium transition',
                        active
                          ? 'bg-primary text-white'
                          : 'bg-surface-muted text-secondary',
                      ].join(' ')}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <StepNav
              busy={busy}
              onBack={() => setStep(2)}
              onNext={() => saveAndGo(4)}
            />
          </div>
        ) : null}

        {step === 4 ? (
          <div data-motion="form" className="max-w-lg space-y-5">
            <h1 data-motion="title" className="font-brand text-3xl font-bold text-secondary">
              Pricing & hours
            </h1>
            <p data-motion="body" className="font-ui text-muted">
              Set simple rates and daily open hours.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block font-ui text-sm font-medium text-secondary">
                Hourly (₹)
                <input
                  className={inputClass}
                  value={form.priceHourly}
                  onChange={(e) => updateField('priceHourly', e.target.value)}
                  disabled={busy}
                  inputMode="decimal"
                />
              </label>
              <label className="block font-ui text-sm font-medium text-secondary">
                Daily (₹)
                <input
                  className={inputClass}
                  value={form.priceDaily}
                  onChange={(e) => updateField('priceDaily', e.target.value)}
                  disabled={busy}
                  inputMode="decimal"
                />
              </label>
              <label className="block font-ui text-sm font-medium text-secondary">
                Opens
                <input
                  className={inputClass}
                  type="time"
                  value={form.openTime}
                  onChange={(e) => updateField('openTime', e.target.value)}
                  disabled={busy}
                />
              </label>
              <label className="block font-ui text-sm font-medium text-secondary">
                Closes
                <input
                  className={inputClass}
                  type="time"
                  value={form.closeTime}
                  onChange={(e) => updateField('closeTime', e.target.value)}
                  disabled={busy}
                />
              </label>
            </div>
            <StepNav
              busy={busy}
              onBack={() => setStep(3)}
              onNext={() => saveAndGo(5)}
            />
          </div>
        ) : null}

        {step === 5 ? (
          <div data-motion="form" className="max-w-xl space-y-5">
            <h1 data-motion="title" className="font-brand text-3xl font-bold text-secondary">
              Review & submit
            </h1>
            <p data-motion="body" className="font-ui text-muted">
              Confirm details. Submitting sends this listing for review.
            </p>
            <dl className="space-y-3 rounded-2xl border border-border/30 bg-surface-muted/60 px-5 py-4 font-ui text-sm">
              <Row label="Name" value={form.name || '—'} />
              <Row label="Type" value={form.locationType || '—'} />
              <Row label="Address" value={form.addressLine1 || '—'} />
              <Row label="Landmark" value={form.landmark || '—'} />
              <Row
                label="Coords"
                value={
                  form.latitude || form.longitude
                    ? `${form.latitude || '—'}, ${form.longitude || '—'}`
                    : '—'
                }
              />
              <Row label="Capacity" value={form.capacity || '—'} />
              <Row label="Covered" value={form.covered ? 'Yes' : 'No'} />
              <Row
                label="Vehicles"
                value={
                  form.vehicleTypes.length
                    ? form.vehicleTypes.join(', ')
                    : '—'
                }
              />
              <Row label="Hourly" value={form.priceHourly ? `₹${form.priceHourly}` : '—'} />
              <Row label="Daily" value={form.priceDaily ? `₹${form.priceDaily}` : '—'} />
              <Row
                label="Hours"
                value={`${form.openTime || '—'} – ${form.closeTime || '—'}`}
              />
            </dl>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => setStep(4)}
                className="rounded-xl border border-border/50 px-5 py-3 font-ui text-sm font-medium text-secondary disabled:opacity-60"
              >
                Back
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={handleSubmit}
                className="rounded-xl bg-primary px-6 py-3 font-ui text-sm font-semibold text-white disabled:opacity-60"
              >
                {busy ? 'Submitting…' : 'Submit for review'}
              </button>
            </div>
          </div>
        ) : null}
      </PageMotion>

      {error ? (
        <p
          className="mt-6 rounded-xl bg-accent-soft px-3 py-3 font-ui text-sm text-secondary-deep"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="mt-6 font-ui text-sm text-primary">{message}</p>
      ) : null}
    </div>
  );
}

function StepNav({ busy, onBack, onNext }) {
  return (
    <div className="flex flex-wrap gap-3 pt-4">
      <button
        type="button"
        disabled={busy}
        onClick={onBack}
        className="rounded-xl border border-border/50 px-5 py-3 font-ui text-sm font-medium text-secondary disabled:opacity-60"
      >
        Back
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={onNext}
        className="rounded-xl bg-primary px-6 py-3 font-ui text-sm font-semibold text-white disabled:opacity-60"
      >
        {busy ? 'Saving…' : 'Continue'}
      </button>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex gap-3 border-b border-border/15 pb-2 last:border-0">
      <dt className="w-28 shrink-0 text-muted">{label}</dt>
      <dd className="font-medium text-secondary">{value}</dd>
    </div>
  );
}
