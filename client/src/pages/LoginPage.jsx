import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { requestOtp, verifyOtp, ApiError } from '../api';
import { useAuth } from '../auth/AuthContext';
import { DecorMark, PageMotion } from '../components';

export function LoginPage() {
  const { isAuthenticated, bootstrapping, setSessionUser } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('phone');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  if (bootstrapping) {
    return (
      <section className="max-w-md">
        <p className="font-ui text-muted">Checking session…</p>
      </section>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleRequestOtp(event) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const result = await requestOtp(phone);
      setStep('otp');
      setInfo(
        `Code sent to ${result.data?.phone || phone}. In local/dev, check the server log for the mock OTP (or use DEV_OTP_FIXED).`,
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not request a code.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleVerifyOtp(event) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await verifyOtp(phone, code);
      setSessionUser(result.data?.user || null);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Could not verify the code.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageMotion className="relative max-w-md" replayKey={step}>
      <DecorMark
        kind="star"
        data-motion="decor"
        className="mb-4 w-7 opacity-50"
      />

      <h1
        data-motion="title"
        className="font-brand text-3xl font-bold tracking-tight text-secondary md:text-4xl"
      >
        Sign in
      </h1>
      <p data-motion="body" className="mt-3 font-ui text-base leading-relaxed text-muted">
        Enter your mobile number to receive a one-time code. SMS is mocked in
        development until a provider is configured.
      </p>

      <div data-motion="form" className="mt-8">
        {step === 'phone' ? (
          <form className="flex flex-col gap-4" onSubmit={handleRequestOtp}>
            <label className="flex flex-col gap-1.5">
              <span className="font-ui text-sm font-medium text-secondary">
                Mobile number
              </span>
              <input
                className="rounded-xl border border-border/55 bg-surface-elevated px-3.5 py-3 font-ui text-base text-secondary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-65"
                type="tel"
                name="phone"
                placeholder="+9198XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                required
                disabled={busy}
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 font-ui text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-55"
              disabled={busy}
            >
              {busy ? 'Sending…' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleVerifyOtp}>
            <label className="flex flex-col gap-1.5">
              <span className="font-ui text-sm font-medium text-secondary">
                Verification code
              </span>
              <input
                className="rounded-xl border border-border/55 bg-surface-elevated px-3.5 py-3 font-ui text-base tracking-[0.2em] text-secondary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-65"
                type="text"
                name="code"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                placeholder="6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                autoComplete="one-time-code"
                required
                disabled={busy}
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 font-ui text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-55"
              disabled={busy}
            >
              {busy ? 'Verifying…' : 'Verify & sign in'}
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl border border-border/55 bg-transparent px-4 py-3 font-ui text-sm font-medium text-secondary transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-55"
              disabled={busy}
              onClick={() => {
                setStep('phone');
                setCode('');
                setError(null);
                setInfo(null);
              }}
            >
              Use a different number
            </button>
          </form>
        )}

        {info ? (
          <p className="mt-5 font-ui text-sm leading-relaxed text-muted">{info}</p>
        ) : null}
        {error ? (
          <p
            className="mt-5 rounded-xl bg-accent-soft px-3.5 py-3 font-ui text-sm text-secondary-deep"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </div>
    </PageMotion>
  );
}
