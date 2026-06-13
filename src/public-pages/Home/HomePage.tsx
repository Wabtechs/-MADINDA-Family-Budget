import HeroSection from './HeroSection';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Statistics from './Statistics';
import Testimonials from './Testimonials';
import FAQ from './FAQ';
import Contact from './Contact';
import { siteContent } from '../../data/site-content';

export default function HomePage() {
  const { presentation } = siteContent;

  return (
    <>
      <HeroSection />

      <section className="section presentation" id="pourquoi-madinda">
        <div className="container">
          <div className="text-center">
            <span className="section-label">Présentation</span>
            <h2 className="section-title">{presentation.title}</h2>
            <p className="section-subtitle">{presentation.subtitle}</p>
          </div>

          <div className="presentation-grid">
            {presentation.points.map((point) => (
              <div key={point.title} className="presentation-card">
                <div className="presentation-icon">
                  {point.icon === 'economy' && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  )}
                  {point.icon === 'tracking' && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                      <line x1="11" y1="8" x2="11" y2="14" />
                    </svg>
                  )}
                  {point.icon === 'decisions' && (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  )}
                </div>
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Features />
      <HowItWorks />

      <section className="section demo" id="demo">
        <div className="container">
          <div className="text-center">
            <span className="section-label">Démonstration</span>
            <h2 className="section-title">Découvrez l'application</h2>
            <p className="section-subtitle">
              Une interface intuitive conçue pour toute la famille.
            </p>
          </div>

          <div className="demo-grid">
            <div className="demo-card">
              <div className="demo-card-image dashboard">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <div className="demo-card-body">
                <h3>Tableau de bord</h3>
                <p>Visualisez l'ensemble de vos finances en un coup d'œil avec un dashboard clair et complet.</p>
              </div>
            </div>

            <div className="demo-card">
              <div className="demo-card-image chart">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <div className="demo-card-body">
                <h3>Graphiques analytiques</h3>
                <p>Suivez vos dépenses avec des graphiques interactifs et comprenez vos habitudes financières.</p>
              </div>
            </div>

            <div className="demo-card">
              <div className="demo-card-image expense">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <div className="demo-card-body">
                <h3>Ajout de dépenses</h3>
                <p>Enregistrez vos dépenses en quelques secondes avec une interface simple et intuitive.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Statistics />
      <Testimonials />
      <FAQ />
      <Contact />
    </>
  );
}
