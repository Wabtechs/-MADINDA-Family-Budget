import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/features', label: 'Fonctionnalités' },
  { to: '/how-it-works', label: 'Comment ça marche' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand fw-bold d-flex align-items-center gap-2">
          <span className="bg-primary text-white rounded-2 px-2 py-1 fs-6">M</span>
          MADINDA
        </Link>

        <button
          className={`navbar-toggler border-0 ${menuOpen ? '' : 'collapsed'}`}
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-controls="mainNav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="mainNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1">
            {navLinks.map((link) => (
              <li className="nav-item" key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `nav-link px-3 rounded-2 ${isActive ? 'active fw-semibold text-primary' : 'text-secondary'}`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="d-flex gap-2">
            <Link to="/login" className="btn btn-outline-primary btn-sm px-3" onClick={() => setMenuOpen(false)}>
              Connexion
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm px-3" onClick={() => setMenuOpen(false)}>
              Inscription
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
