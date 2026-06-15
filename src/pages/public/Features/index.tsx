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
      <section className="hero-gradient text-white py-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 75% 25%, rgba(255,255,255,0.15) 0%, transparent 50%)',
        }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative py-12 text-center">
          <span className="inline-block bg-white/10 text-white rounded-full px-4 py-1 mb-4 text-base font-semibold">Fonctionnalités</span>
          <h1 className="text-6xl font-bold mb-4">Tout ce qu'il vous faut</h1>
          <p className="text-lg text-white/75 mx-auto" style={{ maxWidth: 600 }}>
            Découvrez comment MADINDA peut transformer votre gestion financière familiale.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-6">
            {features.map((f, i) => (
              <div key={i} className="lg:w-1/2">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm border-0 h-full p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <div className="flex gap-6">
                    <div className="shrink-0">
                      <div className="bg-indigo-500/10 text-indigo-500 rounded-lg flex items-center justify-center" style={{ width: 60, height: 60, fontSize: '1.75rem' }}>
                        {f.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold mb-2">{f.title}</h4>
                      <p className="text-gray-500 text-sm mb-4">{f.desc}</p>
                      <ul className="list-none text-sm flex flex-col gap-1 mb-0">
                        {f.bullets.map((b, j) => (
                          <li key={j} className="flex items-center gap-2">
                            <span className="text-indigo-500">✓</span>
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

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-5xl font-bold mb-4">Prêt à commencer ?</h2>
          <p className="text-lg text-gray-500 mx-auto mb-6" style={{ maxWidth: 600 }}>
            Rejoignez des milliers d'utilisateurs qui font confiance à MADINDA.
          </p>
          <Link to="/register" className="inline-flex items-center justify-center font-medium rounded-lg transition-colors bg-indigo-500 text-white hover:bg-indigo-600 px-12 py-4 text-lg font-semibold shadow-lg">
            Créer un compte gratuit
          </Link>
        </div>
      </section>
    </>
  );
}
