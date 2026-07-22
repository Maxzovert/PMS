import pmsIcon from './assets/logo/Pms_Icon.png';
import waveLine from './assets/decor/lines/light-wave-line.svg';

function App() {
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
    </main>
  );
}

export default App;
