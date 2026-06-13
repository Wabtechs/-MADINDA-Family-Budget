import { Link } from 'react-router-dom';
import { siteContent } from '../../data/site-content';

export default function HeroSection() {
  const { hero } = siteContent;

  return (
    <section className="hero" id="accueil">
      <div className="hero-bg">
        <div className="hero-bg-circle" />
        <div className="hero-bg-circle" />
      </div>

      <div className="container">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Application familiale n°1
            </div>

            <h1 className="hero-title">
              {hero.title.split('simplement')[0]}
              <span>simplement</span>
            </h1>

            <p className="hero-subtitle">{hero.subtitle}</p>

            <div className="hero-actions">
              <Link to="/download" className="btn btn-primary btn-lg">
                {hero.cta}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <a href="#features" className="btn btn-secondary btn-lg">
                {hero.secondary}
              </a>
            </div>
          </div>

          <div className="hero-image">
            <div className="hero-illustration">
              <div className="hero-illustration-top">
                <div className="hero-illu-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <div className="hero-illu-name">Famille MADINDA</div>
                  <div className="hero-illu-status">Budget mensuel</div>
                </div>
              </div>

              <div>
                <div className="hero-illu-label">Solde disponible</div>
                <div className="hero-illu-balance">1 245,00 $</div>
              </div>

              <div>
                <div className="hero-illu-label">Dépenses ce mois</div>
                <div className="hero-illu-chart">
                  <div className="hero-illu-bar" />
                  <div className="hero-illu-bar active" />
                  <div className="hero-illu-bar" />
                  <div className="hero-illu-bar" />
                  <div className="hero-illu-bar" />
                  <div className="hero-illu-bar" />
                  <div className="hero-illu-bar" />
                </div>
              </div>

              <div className="hero-illu-footer">
                <div className="hero-illu-footer-item">
                  <span className="hero-illu-footer-value">-12%</span>
                  <span className="hero-illu-footer-label">vs. mois dernier</span>
                </div>
                <div className="hero-illu-footer-item">
                  <span className="hero-illu-footer-value">3</span>
                  <span className="hero-illu-footer-label">Membres</span>
                </div>
                <div className="hero-illu-footer-item">
                  <span className="hero-illu-footer-value">85%</span>
                  <span className="hero-illu-footer-label">Budget utilisé</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
