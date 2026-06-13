import { Outlet, Link } from 'react-router-dom';
import BottomNav from './BottomNav';
import { useAuthStore } from '../store/authStore';
import logo from '../assets/logo.png';

export default function AppLayout() {
  const { user, logout } = useAuthStore();

  return (
    <div className="app-layout">
      <header className="app-header">
        <Link to="/app" className="app-header-logo">
          <img src={logo} alt="MADINDA" className="app-header-logo-img" />
          <span>MADINDA</span>
        </Link>

        <div className="app-header-right">
          <span className="app-header-user">{user?.nom}</span>
          <button className="app-header-logout" onClick={logout} title="Déconnexion">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
