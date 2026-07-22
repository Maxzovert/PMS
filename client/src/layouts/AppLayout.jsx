import { Link, Outlet, useNavigate } from 'react-router-dom';
import pmsIcon from '../assets/logo/Pms_Icon.png';
import { useAuth } from '../auth/AuthContext';

export function AppLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    navigate('/login', { replace: true });
  }

  return (
    <div className="layout layout--app">
      <header className="layout__header layout__header--app">
        <Link to="/dashboard" className="app-brand app-brand--link">
          <img
            className="app-brand__mark"
            src={pmsIcon}
            alt=""
            width={40}
            height={40}
          />
          <span className="app-brand__title">PARKAR PMS</span>
        </Link>
        <button type="button" className="btn btn--ghost" onClick={handleSignOut}>
          Sign out
        </button>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
}
