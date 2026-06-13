import { siteContent } from '../../data/site-content';

export default function Statistics() {
  const { statistics } = siteContent;

  return (
    <section className="section statistics" id="statistiques">
      <div className="container">
        <div className="text-center">
          <span className="section-label">Chiffres</span>
          <h2 className="section-title">Notre impact en chiffres</h2>
          <p className="section-subtitle">
            Des résultats concrets pour les familles qui nous font confiance.
          </p>
        </div>

        <div className="statistics-grid">
          {statistics.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
