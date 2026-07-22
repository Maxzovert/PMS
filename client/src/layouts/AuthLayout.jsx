import { Outlet } from 'react-router-dom';
import pmsIcon from '../assets/logo/Pms_Icon.png';

export function AuthLayout() {
  return (
    <div className="layout layout--auth">
      <header className="layout__header">
        <div className="app-brand">
          <img
            className="app-brand__mark"
            src={pmsIcon}
            alt=""
            width={40}
            height={40}
          />
          <p className="app-brand__title">PARKAR PMS</p>
        </div>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
}
