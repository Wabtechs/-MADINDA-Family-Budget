import { siteContent } from '../../data/site-content';

export default function Testimonials() {
  const { testimonials } = siteContent;

  return (
    <section className="section" id="témoignages">
      <div className="container">
        <div className="text-center">
          <span className="section-label">Témoignages</span>
          <h2 className="section-title">Ce que pensent les familles</h2>
          <p className="section-subtitle">
            Découvrez comment MADINDA aide les familles à mieux gérer leur budget.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div key={t.name} className="testimonial-card">
              <div className="testimonial-stars">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="testimonial-comment">"{t.comment}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.avatar}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
