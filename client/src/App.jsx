import { useEffect, useState } from 'react';
import pmsIcon from './assets/logo/Pms_Icon.png';
import waveLine from './assets/decor/lines/light-wave-line.svg';
import { getHealth, ApiError } from './api';

function App() {
  const [health, setHealth] = useState({
    status: 'loading',
    message: 'Checking API…',
    detail: null,
  });

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
          err instanceof ApiError
            ? err.message
            : 'Could not reach the API.';
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

    return () => controller.abort();
  }, []);

  return (
    <main className="app-shell">
      <div className="app-brand">
        <img
          className="app-brand__mark"
          src={pmsIcon}
          alt="PARKAR PMS"
          width={40}
          height={40}
        />
        <h1 className="app-brand__title">PARKAR PMS</h1>
      </div>
      <p className="app-shell__tagline">
        Parking owner portal — foundation scaffold.
      </p>
      <img
        className="app-shell__accent"
        src={waveLine}
        alt=""
        aria-hidden="true"
      />

      <section
        className={`app-health app-health--${health.status}`}
        aria-live="polite"
      >
        <p className="app-health__label">API status</p>
        <p className="app-health__message">{health.message}</p>
        {health.detail ? (
          <p className="app-health__detail">{health.detail}</p>
        ) : null}
      </section>
    </main>
  );
}

export default App;
