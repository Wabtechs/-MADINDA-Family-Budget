import { useState } from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: '📊', title: 'Tableau de bord en temps réel', desc: 'Vue globale de votre situation financière avec des indicateurs clés mis à jour en temps réel.' },
  { icon: '💰', title: 'Revenus & Dépenses', desc: 'Suivez chaque transaction facilement avec une interface intuitive et rapide.' },
  { icon: '🎯', title: 'Budgets intelligents', desc: 'Définissez et respectez vos budgets avec des alertes automatiques.' },
  { icon: '🏦', title: 'Comptes multiples', desc: 'Gérez banques, Mobile Money et caisse en un seul endroit.' },
  { icon: '📈', title: 'Rapports détaillés', desc: 'Analyses et tendances financières pour mieux comprendre vos habitudes.' },
  { icon: '🔔', title: 'Alertes & Notifications', desc: 'Soyez informé des dépassements et des échéances importantes.' },
];

const steps = [
  { num: '1', title: 'Inscrivez-vous', desc: 'Créez votre compte gratuitement en quelques secondes.' },
  { num: '2', title: 'Créez votre entité', desc: 'Configurez votre famille, association ou entreprise.' },
  { num: '3', title: 'Commencez à gérer', desc: 'Ajoutez vos comptes et enregistrez vos transactions.' },
];

const stats = [
  { value: '10k+', label: 'Utilisateurs actifs' },
  { value: '50k+', label: 'Transactions par jour' },
  { value: '95%', label: 'Satisfaction client' },
  { value: '4.8★', label: 'Évaluation moyenne' },
];

const testimonials = [
  { name: 'Marie K.', role: 'Mère de famille', quote: 'MADINDA a transformé notre gestion budgétaire. Nous économisons 30% de plus chaque mois !', color: 'from-violet-500 to-purple-600' },
  { name: 'Jean-Paul D.', role: 'Chef d\'entreprise', quote: 'Un outil indispensable pour suivre les finances de mon entreprise et de ma famille au quotidien.', color: 'from-blue-500 to-cyan-600' },
  { name: 'Amina T.', role: 'Utilisatrice Mobile Money', quote: 'Enfin une app qui gère à la fois ma banque et mon Mobile Money sans complication !', color: 'from-emerald-500 to-teal-600' },
];

const faqs = [
  { q: 'MADINDA est-il vraiment gratuit ?', a: 'Oui ! Un plan gratuit est disponible avec toutes les fonctionnalités essentielles. Nos plans premium offrent des fonctionnalités avancées comme les rapports exportables et le support prioritaire.' },
  { q: 'Mes données sont-elles sécurisées ?', a: 'Absolument. Nous utilisons un chiffrement de bout en bout AES-256 et suivons les meilleures pratiques de sécurité. Vos données financières sont confidentielles.' },
  { q: 'Puis-je utiliser MADINDA sur plusieurs appareils ?', a: 'Oui, MADINDA est accessible depuis n\'importe quel navigateur web. Une application mobile est en développement pour Android et iOS.' },
  { q: 'Comment gérer plusieurs comptes ?', a: 'Vous pouvez ajouter une infinité de comptes : bancaires, Mobile Money (Orange Money, MTN MoMo, Airtel Money), et de la caisse. Chaque transaction est liée à un compte.' },
  { q: 'Puis-je inviter ma famille ?', a: 'Bien sûr ! Vous pouvez inviter les membres de votre famille et définir des rôles personnalisés pour chacun.' },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState(-1);

  return (
    <>
      <section className="position-relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white">
        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%)',
        }} />
        <div className="container position-relative py-5">
          <div className="row align-items-center py-5">
            <div className="col-lg-6 py-5">
              <span className="d-inline-block bg-white/10 text-white rounded-pill px-3 py-1 mb-3 fs-6 fw-semibold backdrop-blur-sm">
                🚀 Gestion budgétaire intelligente
              </span>
              <h1 className="display-4 fw-bold mb-3 lh-1">
                Gérez vos <span className="text-warning">finances familiales</span> intelligemment
              </h1>
              <p className="lead text-white/75 mb-4 lh-lg">
                MADINDA vous aide à suivre vos revenus, contrôler vos dépenses et atteindre vos objectifs financiers en famille.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/register" className="btn btn-warning btn-lg px-4 fw-semibold shadow-lg">
                  Commencer gratuitement
                </Link>
                <Link to="/features" className="btn btn-outline-light btn-lg px-4 fw-semibold">
                  En savoir plus
                </Link>
              </div>
              <div className="d-flex gap-4 mt-4 pt-2">
                <div className="d-flex align-items-center gap-2">
                  <span className="text-warning">✓</span>
                  <span className="small text-white/75">Sans carte bancaire</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="text-warning">✓</span>
                  <span className="small text-white/75">Annulation gratuite</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-flex justify-content-center pb-5">
              <div className="bg-white/10 backdrop-blur-sm rounded-4 p-4 border border-white/20 shadow-lg" style={{ maxWidth: 480, width: '100%', transform: 'perspective(1000px) rotateY(-5deg)' }}>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="bg-warning bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warning"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div>
                    <div className="fw-semibold text-white">Bienvenue, Famille MADINDA</div>
                    <div className="text-white/60 small">Solde disponible</div>
                  </div>
                  <div className="ms-auto">
                    <span className="badge bg-success/25 text-success px-2 py-1">En ligne</span>
                  </div>
                </div>
                <div className="display-5 fw-bold mb-4 text-white">2 450 000 <span className="fs-5 fw-normal text-white/70">F CFA</span></div>
                <div className="d-flex gap-2 mb-4" style={{ height: 90 }}>
                  {[45, 70, 55, 85, 60, 40, 75, 65, 50, 80, 55, 70].map((h, i) => (
                    <div key={i} className="flex-grow-1 bg-warning/30 rounded-1" style={{ height: `${h}%`, alignSelf: 'flex-end' }} />
                  ))}
                </div>
                <div className="d-flex justify-content-between pt-3 border-top border-white border-opacity-20">
                  <div><div className="fw-bold text-success">+850 000 F</div><div className="small text-white/60">Revenus</div></div>
                  <div><div className="fw-bold text-danger">-420 000 F</div><div className="small text-white/60">Dépenses</div></div>
                  <div><div className="fw-bold text-warning">430 000 F</div><div className="small text-white/60">Épargne</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="position-absolute bottom-0 start-0 w-100" style={{ height: 80, background: 'linear-gradient(to top, var(--bs-body-bg), transparent)' }} />
      </section>

      <section className="py-5 position-relative">
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="d-inline-block bg-primary/10 text-primary rounded-pill px-3 py-1 mb-3 fs-6 fw-semibold">Fonctionnalités</span>
            <h2 className="display-5 fw-bold">Tout ce dont vous avez besoin</h2>
            <p className="lead text-secondary mx-auto" style={{ maxWidth: 600 }}>
              Une suite complète d'outils pour gérer efficacement les finances de votre famille.
            </p>
          </div>
          <div className="row g-4">
            {features.map((f, i) => (
              <div key={i} className="col-md-6 col-lg-4">
                <div className="card border-0 h-100 p-3" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <div className="card-body">
                    <div className="fs-1 mb-3">{f.icon}</div>
                    <h5 className="card-title fw-bold">{f.title}</h5>
                    <p className="card-text text-secondary small">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="d-inline-block bg-primary/10 text-primary rounded-pill px-3 py-1 mb-3 fs-6 fw-semibold">Comment ça marche</span>
            <h2 className="display-5 fw-bold">Commencez en 3 étapes</h2>
            <p className="lead text-secondary mx-auto" style={{ maxWidth: 600 }}>
              MADINDA est conçu pour être simple à prendre en main.
            </p>
          </div>
          <div className="row g-4 justify-content-center position-relative">
            {steps.map((s, i) => (
              <div key={i} className="col-md-4">
                <div className="text-center position-relative">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-lg" style={{ width: 80, height: 80, fontSize: '1.75rem', fontWeight: 800 }}>
                    {s.num}
                  </div>
                  <h5 className="fw-bold">{s.title}</h5>
                  <p className="text-secondary small">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-gradient-to-br from-primary to-slate-800 text-white">
        <div className="container py-4">
          <div className="row g-4 text-center">
            {stats.map((s, i) => (
              <div key={i} className="col-6 col-lg-3">
                <div className="fw-bold" style={{ fontSize: '2.5rem' }}>{s.value}</div>
                <div className="text-white/75 small text-uppercase" style={{ letterSpacing: '0.05em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <span className="d-inline-block bg-primary/10 text-primary rounded-pill px-3 py-1 mb-3 fs-6 fw-semibold">Témoignages</span>
            <h2 className="display-5 fw-bold">Ce que disent nos utilisateurs</h2>
          </div>
          <div className="row g-4">
            {testimonials.map((t, i) => (
              <div key={i} className="col-md-4">
                <div className="card border-0 h-100 p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className={`bg-gradient-to-br ${t.color} text-white rounded-circle d-flex align-items-center justify-content-center fw-bold`} style={{ width: 50, height: 50, fontSize: '1.1rem' }}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="fw-bold small">{t.name}</div>
                      <div className="text-secondary" style={{ fontSize: '0.8rem' }}>{t.role}</div>
                    </div>
                  </div>
                  <p className="card-text text-secondary small mb-0 lh-lg">
                    "{t.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container py-5 text-center">
          <h2 className="display-5 fw-bold mb-3">Prêt à prendre le contrôle de vos finances ?</h2>
          <p className="lead text-secondary mx-auto mb-4" style={{ maxWidth: 600 }}>
            Rejoignez des milliers de familles qui gèrent déjà leur budget avec MADINDA.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg px-5 py-3 fw-semibold shadow-lg">
            Commencer gratuitement →
          </Link>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-5" style={{ maxWidth: 700 }}>
          <div className="text-center mb-5">
            <span className="d-inline-block bg-primary/10 text-primary rounded-pill px-3 py-1 mb-3 fs-6 fw-semibold">FAQ</span>
            <h2 className="display-5 fw-bold">Questions fréquentes</h2>
          </div>
          <div className="d-flex flex-column gap-3">
            {faqs.map((faq, i) => (
              <div key={i} className="card border-0" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <button
                  className="d-flex align-items-center justify-content-between w-100 border-0 bg-transparent p-4 text-start fw-semibold"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  style={{ cursor: 'pointer' }}
                >
                  <span>{faq.q}</span>
                  <span style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-secondary small lh-lg border-top pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
