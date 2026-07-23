import { Outlet } from 'react-router-dom';
import pmsIcon from '../assets/logo/Pms_Icon.png';
import findParking from '../assets/decor/states/find-parking-anywhere.png';
import { DecorMark, DecorWave } from '../components';

export function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-surface text-secondary">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,var(--color-surface-muted)_0%,transparent_55%),radial-gradient(ellipse_at_90%_80%,color-mix(in_srgb,var(--color-primary)_14%,transparent)_0%,transparent_45%)]"
        aria-hidden
      />

      <DecorMark
        kind="star"
        className="absolute top-16 right-[12%] w-8 opacity-40 md:w-10"
      />
      <DecorMark
        kind="dottedCircle"
        className="absolute -left-8 top-40 w-36 opacity-25 md:w-48"
      />
      <DecorMark
        kind="twoCircle"
        className="absolute bottom-24 right-[-1.5rem] w-28 opacity-30 md:w-36"
      />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl lg:grid-cols-2">
        <div className="flex flex-col px-6 py-8 sm:px-10 lg:px-12 lg:py-12">
          <header className="mb-10 flex items-center gap-3">
            <img
              src={pmsIcon}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
            />
            <div>
              <p className="font-brand text-2xl font-bold leading-none tracking-tight text-secondary md:text-3xl">
                PARKAR
              </p>
              <p className="mt-1 font-ui text-xs font-medium uppercase tracking-[0.14em] text-muted">
                Owner portal
              </p>
            </div>
          </header>

          <main className="flex flex-1 flex-col justify-center pb-10">
            <Outlet />
          </main>

          <DecorWave kind="light" className="mt-auto max-w-xs opacity-50" />
        </div>

        <aside
          className="relative hidden overflow-hidden bg-secondary lg:block"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[linear-gradient(160deg,var(--color-secondary)_0%,var(--color-secondary-deep)_55%,color-mix(in_srgb,var(--color-primary)_35%,var(--color-secondary-deep))_100%)]" />
          <DecorMark
            kind="illusOne"
            className="absolute top-10 left-8 w-24 opacity-40"
          />
          <DecorMark
            kind="illusTwo"
            className="absolute bottom-16 right-10 w-28 opacity-35"
          />
          <div className="relative flex h-full flex-col justify-end p-12">
            <img
              src={findParking}
              alt=""
              className="mb-8 max-h-[55vh] w-full object-contain object-bottom opacity-95"
            />
            <p className="font-brand text-2xl font-semibold leading-snug text-surface">
              Never search for parking again.
            </p>
            <p className="mt-2 max-w-sm font-ui text-sm text-surface/75">
              Run your locations, capacity, and bookings from one calm owner
              workspace.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
