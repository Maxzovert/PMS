import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import pmsIcon from '../assets/logo/Pms_Icon.png';
import { useAuth } from '../auth/AuthContext';

export function AppLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/login', { replace: true });
  }

  return (
    <div className="layout layout--app">
      <header className="layout__header layout__header--app">
        <NavLink to="/dashboard" className="app-brand app-brand--link">
          <img
            className="app-brand__mark"
            src={pmsIcon}
            alt=""
            width={40}
            height={40}
          />
          <span className="app-brand__title">PARKAR PMS</span>
        </NavLink>
        <nav className="layout__nav" aria-label="Main">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? 'layout__nav-link layout__nav-link--active' : 'layout__nav-link'
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? 'layout__nav-link layout__nav-link--active' : 'layout__nav-link'
            }
          >
            Profile
          </NavLink>
        </nav>
        <div className="layout__header-actions">
          {user?.phone ? (
            <span className="layout__user-phone">{user.phone}</span>
          ) : null}
          <button
            type="button"
            className="btn btn--ghost"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
}
