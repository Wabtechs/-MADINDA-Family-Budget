import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useEntityStore from '../../store/entityStore';

const navItems = [
  { to: '/app', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', end: true },
  { to: '/app/incomes', label: 'Revenus', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { to: '/app/expenses', label: 'Dépenses', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { to: '/app/accounts', label: 'Comptes', icon: 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3' },
  { to: '/app/transfers', label: 'Transferts', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  { to: '/app/budgets', label: 'Budgets', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { to: '/app/goals', label: 'Objectifs', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  { to: '/app/debts', label: 'Dettes', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { to: '/app/documents', label: 'Documents', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
  { to: '/app/reports', label: 'Rapports', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { currentEntity, entities, setCurrentEntity } = useEntityStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/50"
          style={{ zIndex: 1040 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-gray-100 flex flex-col shrink-0`}
        style={{
          width: '260px',
          minHeight: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1050,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
        }}
      >
        <div className="p-4 border-b border-gray-600">
          <Link to="/app" className="flex items-center gap-2 text-white no-underline">
            <span className="bg-indigo-500 text-white rounded-md px-2 py-1 text-lg font-bold">M</span>
            <span className="font-bold text-lg">MADINDA</span>
          </Link>
        </div>

        {/* Entity selector */}
        {entities.length > 0 && (
          <div className="px-4 pt-4 pb-2 border-b border-gray-600">
            <select
              className="block w-full rounded-lg border border-gray-600 px-2 py-1 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-gray-900 text-gray-100"
              value={currentEntity?.id || ''}
              onChange={(e) => {
                const entity = entities.find((en) => en.id === Number(e.target.value));
                if (entity) setCurrentEntity(entity);
              }}
            >
              {entities.map((entity) => (
                <option key={entity.id} value={entity.id}>{entity.name}</option>
              ))}
            </select>
          </div>
        )}

        <nav className="flex-1 overflow-auto py-2">
          <ul className="flex flex-col list-none p-0 m-0">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 mx-2 rounded-md text-sm font-medium transition-colors ${
                      isActive ? 'bg-indigo-500 text-white' : 'text-gray-100'
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.icon} />
                  </svg>
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-600">
          <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(248, 249, 250, 0.75)' }}>
            <div className="bg-gray-500 rounded-full flex items-center justify-center" style={{ width: 32, height: 32 }}>
              <span className="font-bold text-white text-sm">{(user?.nom || 'U')[0]}</span>
            </div>
            <div className="flex-1 truncate">
              <div className="font-semibold text-white">{user?.nom}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(248, 249, 250, 0.5)' }}>{user?.email}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: '260px' }}>
        {/* Top bar */}
        <header className="bg-white border-b px-6 py-2 flex items-center justify-between sticky top-0 shadow-sm" style={{ zIndex: 1030 }}>
          <div className="flex items-center gap-4">
            <button
              className="inline-flex items-center justify-center font-medium rounded-lg transition-colors px-3 py-1.5 text-sm border border-gray-400 text-gray-600 hover:bg-gray-100 lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Toggle sidebar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/app/notifications" className="inline-flex items-center justify-center font-medium rounded-lg transition-colors px-3 py-1.5 text-sm border border-gray-400 text-gray-600 hover:bg-gray-100 relative rounded-full" style={{ width: 36, height: 36 }} aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            </Link>
            <Link to="/app/profile" className="inline-flex items-center justify-center font-medium rounded-lg transition-colors px-3 py-1.5 text-sm border border-gray-400 text-gray-600 hover:bg-gray-100 rounded-full" style={{ width: 36, height: 36 }} aria-label="Profile">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
            <button
              className="inline-flex items-center justify-center font-medium rounded-lg transition-colors px-3 py-1.5 text-sm border border-red-500 text-red-500 hover:bg-red-50 rounded-full"
              style={{ width: 36, height: 36 }}
              onClick={handleLogout}
              aria-label="Logout"
              title="Déconnexion"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
