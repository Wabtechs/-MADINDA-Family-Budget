import { siteContent } from '../../data/site-content';

export default function HowItWorks() {
  const { howItWorks } = siteContent;

  return (
    <section className="section how-it-works" id="comment-ça-marche">
      <div className="container">
        <div className="text-center">
          <span className="section-label">Fonctionnement</span>
          <h2 className="section-title">Comment ça marche</h2>
          <p className="section-subtitle">
            Commencez en seulement 4 étapes simples.
          </p>
        </div>

        <div className="steps-grid">
          {howItWorks.map((step) => (
            <div key={step.step} className="step-card">
              <div className="step-number">{step.step}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
