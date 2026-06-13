import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/logo.png';

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/features', label: 'Fonctionnalités' },
  { to: '/about', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="header-logo" onClick={() => setMenuOpen(false)}>
          <img src={logo} alt="MADINDA" className="header-logo-img" />
          <span className="header-logo-text">MADINDA</span>
        </Link>

        <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `header-link ${isActive ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="header-nav-actions">
            <Link to="/login" className="btn btn-secondary" onClick={() => setMenuOpen(false)}>
              Connexion
            </Link>
            <Link to="/download" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
              Télécharger
            </Link>
          </div>
        </nav>

        <div className="header-actions">
          <ThemeToggle />
          <button
            className={`header-burger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
