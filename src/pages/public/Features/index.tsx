import { Link } from 'react-router-dom';

const features = [
  {
    icon: '📊',
    title: 'Dashboard temps réel',
    desc: 'Une vue d\'ensemble complète de votre situation financière avec des graphiques interactifs et des indicateurs de performance.',
    bullets: [
      'Graphiques d\'évolution des revenus et dépenses',
      'Indicateurs clés : solde, épargne, tendances',
      'Filtres par période, catégorie et compte',
      'Widgets personnalisables',
    ],
  },
  {
    icon: '🏦',
    title: 'Gestion multi-comptes',
    desc: 'Centralisez tous vos comptes financiers en un seul endroit pour une vision à 360°.',
    bullets: [
      'Comptes bancaires traditionnels',
      'Mobile Money : Orange Money, MTN MoMo, Airtel Money',
      'Caisse / Espèces',
      'Transferts entre comptes',
    ],
  },
  {
    icon: '💰',
    title: 'Revenus & Dépenses',
    desc: 'Un système complet de gestion des transactions avec support de pièces jointes.',
    bullets: [
      'CRUD complet : création, modification, suppression',
      'Pièces jointes (photos, PDF) pour chaque transaction',
      'Catégorisation automatique et personnalisée',
      'Transactions récurrentes programmées',
    ],
  },
  {
    icon: '🎯',
    title: 'Budgets intelligents',
    desc: 'Définissez des limites budgétaires et recevez des alertes en cas de dépassement.',
    bullets: [
      'Budgets mensuels et annuels par catégorie',
      'Alertes de dépassement en temps réel',
      'Suivi de progression visuel',
      'Recommandations personnalisées',
    ],
  },
  {
    icon: '⭐',
    title: 'Objectifs financiers',
    desc: 'Fixez des objectifs d\'épargne et suivez votre progression vers leur réalisation.',
    bullets: [
      'Objectifs d\'épargne personnalisés',
      'Projets familiaux (voyages, études, achats)',
      'Suivi visuel de la progression',
      'Échéanciers et rappels',
    ],
  },
  {
    icon: '📋',
    title: 'Dettes & Crédits',
    desc: 'Suivez vos dettes et crédits avec un système de gestion des remboursements.',
    bullets: [
      'Enregistrement des dettes et créances',
      'Planification des remboursements',
      'Rappels d\'échéances',
      'Calcul des intérêts',
    ],
  },
  {
    icon: '📄',
    title: 'Rapports exportables',
    desc: 'Générez des rapports détaillés pour analyser vos finances et les partager.',
    bullets: [
      'Export PDF pour impression et partage',
      'Export CSV pour analyse dans Excel',
      'Graphiques et tableaux détaillés',
      'Rapports personnalisables par période',
    ],
  },
  {
    icon: '🔔',
    title: 'Notifications intelligentes',
    desc: 'Restez informé en temps réel de l\'état de vos finances.',
    bullets: [
      'Alertes de dépassement de budget',
      'Rappels de transactions récurrentes',
      'Notifications de rapprochement bancaire',
      'Résumé hebdomadaire par email',
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white py-5 position-relative overflow-hidden">
        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 75% 25%, rgba(255,255,255,0.15) 0%, transparent 50%)',
        }} />
        <div className="container position-relative py-5 text-center">
          <span className="d-inline-block bg-white bg-opacity-10 text-white rounded-pill px-3 py-1 mb-3 fs-6 fw-semibold">Fonctionnalités</span>
          <h1 className="display-4 fw-bold mb-3">Tout ce qu'il vous faut</h1>
          <p className="lead text-white text-opacity-75 mx-auto" style={{ maxWidth: 600 }}>
            Découvrez comment MADINDA peut transformer votre gestion financière familiale.
          </p>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-4">
          <div className="row g-4">
            {features.map((f, i) => (
              <div key={i} className="col-lg-6">
                <div className="card border-0 h-100 p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <div className="d-flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="bg-primary bg-opacity-10 text-primary rounded-3 d-flex align-items-center justify-content-center" style={{ width: 60, height: 60, fontSize: '1.75rem' }}>
                        {f.icon}
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h4 className="fw-bold mb-2">{f.title}</h4>
                      <p className="text-secondary small mb-3">{f.desc}</p>
                      <ul className="list-unstyled small d-flex flex-column gap-1 mb-0">
                        {f.bullets.map((b, j) => (
                          <li key={j} className="d-flex align-items-center gap-2">
                            <span className="text-primary">✓</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container py-5 text-center">
          <h2 className="display-5 fw-bold mb-3">Prêt à commencer ?</h2>
          <p className="lead text-secondary mx-auto mb-4" style={{ maxWidth: 600 }}>
            Rejoignez des milliers d'utilisateurs qui font confiance à MADINDA.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg px-5 py-3 fw-semibold shadow-lg">
            Créer un compte gratuit
          </Link>
        </div>
      </section>
    </>
  );
}
