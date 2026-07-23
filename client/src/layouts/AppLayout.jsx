import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import pmsIcon from '../assets/logo/Pms_Icon.png';
import { useAuth } from '../auth/AuthContext';
import { DecorMark, DecorWave } from '../components';

export function AppLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/login', { replace: true });
  }

  return (
    <div className="relative min-h-screen bg-surface text-secondary">
      <header className="relative z-20 border-b border-secondary-deep/20 bg-secondary text-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3 text-inherit no-underline"
          >
            <img
              src={pmsIcon}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <span className="font-brand text-lg font-bold tracking-tight text-surface">
              PARKAR PMS
            </span>
          </NavLink>

          <nav className="flex items-center gap-1" aria-label="Main">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                [
                  'rounded-lg px-3 py-2 font-ui text-sm font-medium no-underline transition',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-surface/80 hover:bg-surface/10 hover:text-surface',
                ].join(' ')
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                [
                  'rounded-lg px-3 py-2 font-ui text-sm font-medium no-underline transition',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-surface/80 hover:bg-surface/10 hover:text-surface',
                ].join(' ')
              }
            >
              Profile
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            {user?.phone ? (
              <span className="hidden font-ui text-xs text-surface/80 sm:inline">
                {user.phone}
              </span>
            ) : null}
            <button
              type="button"
              className="rounded-lg border border-surface/30 bg-transparent px-3 py-2 font-ui text-sm font-medium text-surface transition hover:bg-surface/10"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
        </div>
        <DecorWave
          kind="light"
          className="pointer-events-none absolute bottom-0 left-0 w-48 opacity-20"
        />
      </header>

      <DecorMark
        kind="oneCircle"
        className="pointer-events-none absolute top-28 right-6 w-24 opacity-15 md:w-32"
      />

      <main className="relative z-10 mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-10">
        <Outlet />
      </main>
    </div>
  );
}
