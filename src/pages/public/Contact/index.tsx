const contactInfo = [
  { icon: '✉️', title: 'Email', value: 'contact@madinda.app', href: 'mailto:contact@madinda.app' },
  { icon: '📞', title: 'Téléphone', value: '+243 800 000 000', href: 'tel:+243800000000' },
  { icon: '📍', title: 'Adresse', value: 'Kinshasa, République Démocratique du Congo', href: null },
];

const socialLinks = [
  { name: 'Facebook', icon: 'f', bg: 'bg-facebook' },
  { name: 'Twitter', icon: '𝕏', bg: 'bg-dark' },
  { name: 'LinkedIn', icon: 'in', bg: 'bg-primary' },
  { name: 'Instagram', icon: '📷', bg: 'gradient-purple-pink' },
];

export default function ContactPage() {
  return (
    <>
      <section className="hero-gradient text-white py-5 position-relative overflow-hidden">
        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 25% 75%, rgba(255,255,255,0.15) 0%, transparent 50%)',
        }} />
        <div className="container position-relative py-5 text-center">
          <span className="d-inline-block bg-white bg-opacity-10 text-white rounded-pill px-3 py-1 mb-3 fs-6 fw-semibold">Contact</span>
          <h1 className="display-4 fw-bold mb-3">Contactez-nous</h1>
          <p className="lead text-white text-opacity-75 mx-auto" style={{ maxWidth: 600 }}>
            Une question ? Une suggestion ? Notre équipe est là pour vous aider.
          </p>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-4">
          <div className="row g-5">
            <div className="col-lg-7">
              <div className="card border-0 p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 className="fw-bold mb-1">Envoyez-nous un message</h3>
                <p className="text-secondary small mb-4">Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.</p>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Nom complet</label>
                      <input type="text" className="form-control form-control-lg" placeholder="Votre nom" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Email</label>
                      <input type="email" className="form-control form-control-lg" placeholder="votre@email.com" />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Sujet</label>
                      <select className="form-select form-select-lg">
                        <option value="">Sélectionnez un sujet</option>
                        <option value="support">Support technique</option>
                        <option value="commercial">Question commerciale</option>
                        <option value="suggestion">Suggestion</option>
                        <option value="bug">Signaler un bug</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Message</label>
                      <textarea className="form-control form-control-lg" rows={6} placeholder="Décrivez votre question ou votre suggestion..." />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary btn-lg px-5 fw-semibold">
                        Envoyer le message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="d-flex flex-column gap-4 mb-4">
                {contactInfo.map((info, i) => (
                  <div key={i} className="card border-0 p-3" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary bg-opacity-10 text-primary rounded-2 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 48, height: 48, fontSize: '1.3rem' }}>
                        {info.icon}
                      </div>
                      <div>
                        <div className="fw-semibold small">{info.title}</div>
                        {info.href ? (
                          <a href={info.href} className="text-decoration-none text-dark small">{info.value}</a>
                        ) : (
                          <span className="text-secondary small">{info.value}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card border-0 p-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h6 className="fw-bold mb-3">Suivez-nous</h6>
                <div className="d-flex gap-2">
                  {socialLinks.map((s, i) => (
                    <a
                      key={i}
                      href="#"
                      className={`${s.bg} text-white rounded-circle d-flex align-items-center justify-content-center text-decoration-none`}
                      style={{ width: 40, height: 40, fontSize: '0.85rem', fontWeight: 700 }}
                      aria-label={s.name}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>

              <div className="card border-0 p-4 mt-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h6 className="fw-bold mb-3">Notre localisation</h6>
                <div className="bg-secondary bg-opacity-10 rounded-3 d-flex align-items-center justify-content-center" style={{ height: 200 }}>
                  <div className="text-center text-secondary">
                    <div className="fs-1 mb-2">🗺️</div>
                    <div className="small">Kinshasa, RDC</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container py-4 text-center">
          <h2 className="display-5 fw-bold mb-3">Prêt à commencer ?</h2>
          <p className="lead text-secondary mx-auto mb-4" style={{ maxWidth: 500 }}>
            Créez votre compte gratuitement et rejoignez des milliers de familles.
          </p>
          <a href="/register" className="btn btn-primary btn-lg px-5 py-3 fw-semibold shadow-lg">
            Créer un compte gratuit
          </a>
        </div>
      </section>
    </>
  );
}
