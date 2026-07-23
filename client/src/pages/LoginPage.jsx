import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { requestOtp, verifyOtp, ApiError } from '../api';
import { useAuth } from '../auth/AuthContext';

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
      <section className="page page--login">
        <p className="page__lead">Checking session…</p>
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
    <section className="page page--login">
      <h1 className="page__title">Sign in</h1>
      <p className="page__lead">
        Enter your mobile number to receive a one-time code. SMS is mocked in
        development until a provider is configured.
      </p>

      {step === 'phone' ? (
        <form className="login-form" onSubmit={handleRequestOtp}>
          <label className="field">
            <span className="field__label">Mobile number</span>
            <input
              className="field__input"
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
          <button type="submit" className="btn btn--primary" disabled={busy}>
            {busy ? 'Sending…' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form className="login-form" onSubmit={handleVerifyOtp}>
          <label className="field">
            <span className="field__label">Verification code</span>
            <input
              className="field__input"
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
          <button type="submit" className="btn btn--primary" disabled={busy}>
            {busy ? 'Verifying…' : 'Verify & sign in'}
          </button>
          <button
            type="button"
            className="btn btn--ghost-dark"
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

      {info ? <p className="page__note">{info}</p> : null}
      {error ? (
        <p className="page__error" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
