import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-3">
      <div className="container">
        <div className="row g-4 pb-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="bg-primary text-white rounded-2 px-2 py-1 fs-6 fw-bold">M</span>
              <span className="fw-bold fs-5">MADINDA</span>
            </div>
            <p className="text-secondary small lh-lg" style={{ maxWidth: '300px' }}>
              MADINDA Family Budget est une application moderne de gestion budgétaire conçue pour aider les familles à maîtriser leurs finances.
            </p>
            <div className="d-flex gap-2">
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }} aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }} aria-label="Twitter">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="btn btn-outline-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }} aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h6 className="fw-bold text-uppercase small mb-3">Liens rapides</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><Link to="/" className="text-secondary text-decoration-none" style={{ transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#f8f9fa')} onMouseLeave={e => (e.currentTarget.style.color = '')}>Accueil</Link></li>
              <li><Link to="/features" className="text-secondary text-decoration-none" style={{ transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#f8f9fa')} onMouseLeave={e => (e.currentTarget.style.color = '')}>Fonctionnalités</Link></li>
              <li><Link to="/how-it-works" className="text-secondary text-decoration-none" style={{ transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#f8f9fa')} onMouseLeave={e => (e.currentTarget.style.color = '')}>Comment ça marche</Link></li>
              <li><Link to="/contact" className="text-secondary text-decoration-none" style={{ transition: 'color 0.2s' }} onMouseEnter={e => (e.currentTarget.style.color = '#f8f9fa')} onMouseLeave={e => (e.currentTarget.style.color = '')}>Contact</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-uppercase small mb-3">Légal</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><a href="#" className="text-secondary text-decoration-none">Conditions d'utilisation</a></li>
              <li><a href="#" className="text-secondary text-decoration-none">Politique de confidentialité</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-uppercase small mb-3">Contact</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><a href="mailto:contact@madinda.app" className="text-secondary text-decoration-none">contact@madinda.app</a></li>
              <li><span className="text-secondary">Kinshasa, RDC</span></li>
            </ul>
          </div>
        </div>

        <div className="border-top border-secondary pt-3 mt-2">
          <p className="text-center text-secondary small mb-0">
            &copy; {new Date().getFullYear()} MADINDA Family Budget. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
