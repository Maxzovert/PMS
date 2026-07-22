import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function LoginPage() {
  const { devSignIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleDevSignIn() {
    devSignIn();
    navigate('/dashboard', { replace: true });
  }

  return (
    <section className="page page--login">
      <h1 className="page__title">Sign in</h1>
      <p className="page__lead">
        Owner login will use mobile number + OTP. That flow is not implemented
        yet — this screen is a Phase 1 placeholder only.
      </p>

      <form
        className="login-form"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="field">
          <span className="field__label">Mobile number</span>
          <input
            className="field__input"
            type="tel"
            name="phone"
            placeholder="+91 …"
            disabled
            autoComplete="tel"
          />
        </label>
        <button type="button" className="btn btn--primary" disabled>
          Send OTP
        </button>
      </form>

      <p className="page__note">
        Placeholder only — no SMS is sent. Use the button below to open the
        dashboard shell locally.
      </p>
      <button
        type="button"
        className="btn btn--secondary"
        onClick={handleDevSignIn}
      >
        Continue to dashboard (dev stub)
      </button>
    </section>
  );
}
