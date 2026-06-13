export default function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="container">
        <div className="text-center">
          <span className="section-label">Contact</span>
          <h2 className="section-title">Parlons de votre projet</h2>
          <p className="section-subtitle">
            Une question ? N'hésitez pas à nous contacter. Nous vous répondrons dans les plus brefs délais.
          </p>
        </div>

        <div className="contact-content">
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="contact-row">
              <div className="contact-field">
                <label htmlFor="name">Nom complet</label>
                <input type="text" id="name" placeholder="Votre nom" />
              </div>
              <div className="contact-field">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="votre@email.com" />
              </div>
            </div>
            <div className="contact-field">
              <label htmlFor="subject">Sujet</label>
              <input type="text" id="subject" placeholder="Sujet de votre message" />
            </div>
            <div className="contact-field">
              <label htmlFor="message">Message</label>
              <textarea id="message" placeholder="Votre message..." />
            </div>
            <button type="submit" className="btn btn-primary btn-lg">
              Envoyer le message
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
