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
      <section className="py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-500 opacity-5 rounded-l-2xl" style={{ clipPath: 'polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="text-center mb-12">
            <span className="inline-block bg-indigo-500/10 text-indigo-500 rounded-full px-4 py-1 mb-4 text-base font-semibold">Fonctionnement</span>
            <h1 className="text-6xl font-bold mb-4">Comment ça marche ?</h1>
            <p className="text-lg text-gray-500 mx-auto" style={{ maxWidth: 600 }}>
              MADINDA est conçu pour être simple à prendre en main. Suivez ces étapes pour commencer.
            </p>
          </div>

          <div className="position-relative">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-wrap gap-6 mb-12 items-center">
                {i % 2 === 0 ? (
                  <>
                    <div className="lg:w-5/12">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg shrink-0" style={{ width: 60, height: 60, fontSize: '1.5rem', fontWeight: 800 }}>
                          {s.step}
                        </div>
                        <h3 className="font-bold mb-0">{s.title}</h3>
                      </div>
                      <p className="text-gray-500 mb-4">{s.desc}</p>
                      <ul className="list-none text-sm flex flex-col gap-2">
                        {s.details.map((d, j) => (
                          <li key={j} className="flex items-center gap-2">
                            <span className="bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center shrink-0" style={{ width: 24, height: 24, fontSize: '0.75rem' }}>✓</span>
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="lg:w-1/6 hidden lg:flex justify-center">
                      <div className="bg-indigo-500/10 rounded-full" style={{ width: 4, height: 80 }} />
                    </div>
                    <div className="lg:w-5/12 hidden lg:flex justify-center">
                      <div className="bg-gray-50 rounded-lg p-6 border w-full" style={{ maxWidth: 320 }}>
                        <div className="bg-white rounded-md p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="bg-indigo-500/10 rounded-md px-2 py-1" style={{ width: 24, height: 24 }} />
                            <div className="bg-gray-500/10 rounded-md" style={{ width: 100, height: 10 }} />
                          </div>
                          <div className="bg-gray-500/10 rounded-md mb-2" style={{ width: '100%', height: 60 }} />
                          <div className="flex gap-2">
                            <div className="bg-gray-500/10 rounded-md flex-1" style={{ height: 30 }} />
                            <div className="bg-indigo-500/20 rounded-md" style={{ width: 60, height: 30 }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="lg:w-5/12 hidden lg:flex justify-center order-lg-3">
                      <div className="bg-gray-50 rounded-lg p-6 border w-full" style={{ maxWidth: 320 }}>
                        <div className="bg-white rounded-md p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="bg-indigo-500/10 rounded-md px-2 py-1" style={{ width: 24, height: 24 }} />
                            <div className="bg-gray-500/10 rounded-md" style={{ width: 100, height: 10 }} />
                          </div>
                          <div className="bg-gray-500/10 rounded-md mb-2" style={{ width: '100%', height: 60 }} />
                          <div className="flex gap-2">
                            <div className="bg-gray-500/10 rounded-md flex-1" style={{ height: 30 }} />
                            <div className="bg-indigo-500/20 rounded-md" style={{ width: 60, height: 30 }} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lg:w-1/6 hidden lg:flex justify-center order-lg-2">
                      <div className="bg-indigo-500/10 rounded-full" style={{ width: 4, height: 80 }} />
                    </div>
                    <div className="lg:w-5/12 order-lg-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg shrink-0" style={{ width: 60, height: 60, fontSize: '1.5rem', fontWeight: 800 }}>
                          {s.step}
                        </div>
                        <h3 className="font-bold mb-0">{s.title}</h3>
                      </div>
                      <p className="text-gray-500 mb-4">{s.desc}</p>
                      <ul className="list-none text-sm flex flex-col gap-2">
                        {s.details.map((d, j) => (
                          <li key={j} className="flex items-center gap-2">
                            <span className="bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center shrink-0" style={{ width: 24, height: 24, fontSize: '0.75rem' }}>✓</span>
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

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-wrap items-center gap-12">
            <div className="lg:w-1/2">
              <span className="inline-block bg-indigo-500/10 text-indigo-500 rounded-full px-4 py-1 mb-4 text-base font-semibold">Aperçu</span>
              <h2 className="text-5xl font-bold mb-4">Un tableau de bord complet</h2>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Dès votre connexion, vous accédez à un tableau de bord qui résume l'essentiel de votre situation financière : solde des comptes, évolution des revenus et dépenses, budgets en cours et objectifs d'épargne.
              </p>
              <Link to="/register" className="inline-flex items-center justify-center font-medium rounded-lg transition-colors bg-indigo-500 text-white hover:bg-indigo-600 px-6 py-2 font-semibold">
                Découvrir le tableau de bord
              </Link>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-white rounded-xl shadow-lg p-6 border">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b">
                  <div className="bg-indigo-500/10 rounded-md flex items-center justify-center" style={{ width: 40, height: 40 }}>
                    <span className="text-indigo-500 font-bold">M</span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-500/10 rounded-md mb-1" style={{ width: 150, height: 12 }} />
                    <div className="bg-gray-500/10 rounded-md" style={{ width: 100, height: 8 }} />
                  </div>
                  <div className="bg-emerald-500/10 rounded-md px-4 py-1">
                    <span className="text-emerald-500 text-sm font-semibold">2 450 000 F</span>
                  </div>
                </div>
                <div className="flex gap-2 mb-6" style={{ height: 120 }}>
                  {[40, 65, 50, 80, 55, 45, 75, 60, 85, 50, 70, 55].map((h, i) => (
                    <div key={i} className="flex-1 bg-indigo-500/20 rounded" style={{ height: `${h}%`, alignSelf: 'flex-end' }} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-4">
                  {[750000, 420000, 330000].map((val, i) => (
                    <div key={i} className="w-1/3">
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="text-sm text-gray-500">{['Revenus', 'Dépenses', 'Épargne'][i]}</div>
                        <div className={`font-bold ${i === 0 ? 'text-emerald-500' : i === 1 ? 'text-red-500' : 'text-indigo-500'}`}>{val.toLocaleString()} F</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h2 className="text-5xl font-bold mb-4">Prêt à prendre le contrôle ?</h2>
          <p className="text-lg text-gray-500 mx-auto mb-6" style={{ maxWidth: 600 }}>
            Rejoignez MADINDA et commencez à gérer vos finances familialess intelligemment.
          </p>
          <Link to="/register" className="inline-flex items-center justify-center font-medium rounded-lg transition-colors bg-indigo-500 text-white hover:bg-indigo-600 px-12 py-4 text-lg font-semibold shadow-lg">
            Commencer maintenant →
          </Link>
        </div>
      </section>
    </>
  );
}
