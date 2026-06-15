import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/features', label: 'Fonctionnalités' },
  { to: '/how-it-works', label: 'Comment ça marche' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b sticky top-0 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between flex-wrap">
        <Link to="/" className="text-lg font-bold flex items-center gap-2">
          <span className="bg-indigo-500 text-white rounded-md px-2 py-1 text-base">M</span>
          MADINDA
        </Link>

        <button
          className="lg:hidden p-2 rounded-md border border-gray-300"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-controls="mainNav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {menuOpen ? (
              <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
            ) : (
              <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
            )}
          </svg>
        </button>

        <div className={`w-full lg:w-auto lg:flex-1 ${menuOpen ? 'block' : 'hidden'} lg:flex lg:items-center lg:justify-between`} id="mainNav">
          <ul className="flex flex-col lg:flex-row items-center gap-1 mx-auto">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'font-semibold text-indigo-500' : 'text-gray-500'}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login" className="inline-flex items-center justify-center font-medium rounded-lg transition-colors px-3 py-1.5 text-sm border border-indigo-500 text-indigo-500 hover:bg-indigo-50" onClick={() => setMenuOpen(false)}>
              Connexion
            </Link>
            <Link to="/register" className="inline-flex items-center justify-center font-medium rounded-lg transition-colors px-3 py-1.5 text-sm bg-indigo-500 text-white hover:bg-indigo-600" onClick={() => setMenuOpen(false)}>
              Inscription
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
