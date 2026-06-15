import { Link } from 'react-router-dom';

const steps = [
  {
    step: 1,
    title: 'Créez votre compte',
    desc: 'Inscrivez-vous gratuitement avec votre email, nom et mot de passe. Le processus prend moins d\'une minute.',
    details: [
      'Choisissez un email valide',
      'Définissez un mot de passe sécurisé',
      'Complétez votre profil',
    ],
  },
  {
    step: 2,
    title: 'Configurez votre entité',
    desc: 'Créez votre espace de gestion : famille, entreprise ou association selon vos besoins.',
    details: [
      'Choisissez le type d\'entité',
      'Ajoutez les membres',
      'Définissez les rôles et permissions',
    ],
  },
  {
    step: 3,
    title: 'Ajoutez vos comptes et catégories',
    desc: 'Connectez vos comptes bancaires, Mobile Money et définissez vos catégories de dépenses.',
    details: [
      'Comptes bancaires et Mobile Money',
      'Catégories de revenus et dépenses',
      'Budgets mensuels personnalisés',
    ],
  },
  {
    step: 4,
    title: 'Commencez à enregistrer',
    desc: 'Saisissez vos transactions quotidiennes et laissez MADINDA faire le reste.',
    details: [
      'Enregistrement rapide des transactions',
      'Pièces jointes et justificatifs',
      'Analyse et rapports automatiques',
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="py-5 position-relative overflow-hidden">
        <div className="position-absolute top-0 end-0 w-50 h-100 bg-primary opacity-5 rounded-start-5" style={{ clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)' }} />
        <div className="container py-5 position-relative">
          <div className="text-center mb-5">
            <span className="d-inline-block bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-1 mb-3 fs-6 fw-semibold">Fonctionnement</span>
            <h1 className="display-4 fw-bold mb-3">Comment ça marche ?</h1>
            <p className="lead text-secondary mx-auto" style={{ maxWidth: 600 }}>
              MADINDA est conçu pour être simple à prendre en main. Suivez ces étapes pour commencer.
            </p>
          </div>

          <div className="position-relative">
            {steps.map((s, i) => (
              <div key={i} className="row g-4 mb-5 align-items-center">
                {i % 2 === 0 ? (
                  <>
                    <div className="col-lg-5">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-lg flex-shrink-0" style={{ width: 60, height: 60, fontSize: '1.5rem', fontWeight: 800 }}>
                          {s.step}
                        </div>
                        <h3 className="fw-bold mb-0">{s.title}</h3>
                      </div>
                      <p className="text-secondary mb-3">{s.desc}</p>
                      <ul className="list-unstyled small d-flex flex-column gap-2">
                        {s.details.map((d, j) => (
                          <li key={j} className="d-flex align-items-center gap-2">
                            <span className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 24, height: 24, fontSize: '0.75rem' }}>✓</span>
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-lg-2 d-none d-lg-flex justify-content-center">
                      <div className="bg-primary bg-opacity-10 rounded-circle" style={{ width: 4, height: 80 }} />
                    </div>
                    <div className="col-lg-5 d-none d-lg-flex justify-content-center">
                      <div className="bg-light rounded-3 p-4 border w-100" style={{ maxWidth: 320 }}>
                        <div className="bg-white rounded-2 p-3 shadow-sm">
                          <div className="d-flex align-items-center gap-2 mb-3">
                            <div className="bg-primary bg-opacity-10 rounded-2 px-2 py-1" style={{ width: 24, height: 24 }} />
                            <div className="bg-secondary bg-opacity-10 rounded-2" style={{ width: 100, height: 10 }} />
                          </div>
                          <div className="bg-secondary bg-opacity-10 rounded-2 mb-2" style={{ width: '100%', height: 60 }} />
                          <div className="d-flex gap-2">
                            <div className="bg-secondary bg-opacity-10 rounded-2 flex-grow-1" style={{ height: 30 }} />
                            <div className="bg-primary bg-opacity-20 rounded-2" style={{ width: 60, height: 30 }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-lg-5 d-none d-lg-flex justify-content-center order-lg-3">
                      <div className="bg-light rounded-3 p-4 border w-100" style={{ maxWidth: 320 }}>
                        <div className="bg-white rounded-2 p-3 shadow-sm">
                          <div className="d-flex align-items-center gap-2 mb-3">
                            <div className="bg-primary bg-opacity-10 rounded-2 px-2 py-1" style={{ width: 24, height: 24 }} />
                            <div className="bg-secondary bg-opacity-10 rounded-2" style={{ width: 100, height: 10 }} />
                          </div>
                          <div className="bg-secondary bg-opacity-10 rounded-2 mb-2" style={{ width: '100%', height: 60 }} />
                          <div className="d-flex gap-2">
                            <div className="bg-secondary bg-opacity-10 rounded-2 flex-grow-1" style={{ height: 30 }} />
                            <div className="bg-primary bg-opacity-20 rounded-2" style={{ width: 60, height: 30 }} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 d-none d-lg-flex justify-content-center order-lg-2">
                      <div className="bg-primary bg-opacity-10 rounded-circle" style={{ width: 4, height: 80 }} />
                    </div>
                    <div className="col-lg-5 order-lg-1">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-lg flex-shrink-0" style={{ width: 60, height: 60, fontSize: '1.5rem', fontWeight: 800 }}>
                          {s.step}
                        </div>
                        <h3 className="fw-bold mb-0">{s.title}</h3>
                      </div>
                      <p className="text-secondary mb-3">{s.desc}</p>
                      <ul className="list-unstyled small d-flex flex-column gap-2">
                        {s.details.map((d, j) => (
                          <li key={j} className="d-flex align-items-center gap-2">
                            <span className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: 24, height: 24, fontSize: '0.75rem' }}>✓</span>
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="d-inline-block bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-1 mb-3 fs-6 fw-semibold">Aperçu</span>
              <h2 className="display-5 fw-bold mb-3">Un tableau de bord complet</h2>
              <p className="text-secondary mb-4 lh-lg">
                Dès votre connexion, vous accédez à un tableau de bord qui résume l'essentiel de votre situation financière : solde des comptes, évolution des revenus et dépenses, budgets en cours et objectifs d'épargne.
              </p>
              <Link to="/register" className="btn btn-primary px-4 py-2 fw-semibold">
                Découvrir le tableau de bord
              </Link>
            </div>
            <div className="col-lg-6">
              <div className="bg-white rounded-4 shadow-lg p-4 border">
                <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                  <div className="bg-primary bg-opacity-10 rounded-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                    <span className="text-primary fw-bold">M</span>
                  </div>
                  <div className="flex-grow-1">
                    <div className="bg-secondary bg-opacity-10 rounded-2 mb-1" style={{ width: 150, height: 12 }} />
                    <div className="bg-secondary bg-opacity-10 rounded-2" style={{ width: 100, height: 8 }} />
                  </div>
                  <div className="bg-success bg-opacity-10 rounded-2 px-3 py-1">
                    <span className="text-success small fw-semibold">2 450 000 F</span>
                  </div>
                </div>
                <div className="d-flex gap-2 mb-4" style={{ height: 120 }}>
                  {[40, 65, 50, 80, 55, 45, 75, 60, 85, 50, 70, 55].map((h, i) => (
                    <div key={i} className="flex-grow-1 bg-primary bg-opacity-20 rounded-1" style={{ height: `${h}%`, alignSelf: 'flex-end' }} />
                  ))}
                </div>
                <div className="row g-3">
                  {[750000, 420000, 330000].map((val, i) => (
                    <div key={i} className="col-4">
                      <div className="bg-light rounded-3 p-3 text-center">
                        <div className="small text-secondary">{['Revenus', 'Dépenses', 'Épargne'][i]}</div>
                        <div className={`fw-bold ${i === 0 ? 'text-success' : i === 1 ? 'text-danger' : 'text-primary'}`}>{val.toLocaleString()} F</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 text-center">
        <div className="container py-4">
          <h2 className="display-5 fw-bold mb-3">Prêt à prendre le contrôle ?</h2>
          <p className="lead text-secondary mx-auto mb-4" style={{ maxWidth: 600 }}>
            Rejoignez MADINDA et commencez à gérer vos finances familialess intelligemment.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg px-5 py-3 fw-semibold shadow-lg">
            Commencer maintenant →
          </Link>
        </div>
      </section>
    </>
  );
}
