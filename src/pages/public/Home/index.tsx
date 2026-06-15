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
  { name: 'Marie K.', role: 'Mère de famille', quote: 'MADINDA a transformé notre gestion budgétaire. Nous économisons 30% de plus chaque mois !', color: 'gradient-violet' },
  { name: 'Jean-Paul D.', role: 'Chef d\'entreprise', quote: 'Un outil indispensable pour suivre les finances de mon entreprise et de ma famille au quotidien.', color: 'gradient-blue' },
  { name: 'Amina T.', role: 'Utilisatrice Mobile Money', quote: 'Enfin une app qui gère à la fois ma banque et mon Mobile Money sans complication !', color: 'gradient-emerald' },
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
      <section className="relative overflow-hidden hero-gradient text-white">
        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.2) 0%, transparent 50%)',
        }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative py-12">
          <div className="flex flex-wrap items-center py-12">
            <div className="lg:w-1/2 py-12">
              <span className="inline-block bg-white/10 text-white rounded-full px-4 py-1 mb-4 text-base font-semibold backdrop-blur-sm">
                🚀 Gestion budgétaire intelligente
              </span>
              <h1 className="text-6xl font-bold mb-4 leading-none">
                Gérez vos <span className="text-yellow-500">finances familiales</span> intelligemment
              </h1>
              <p className="text-lg text-gray-600 text-white/75 mb-6 leading-relaxed">
                MADINDA vous aide à suivre vos revenus, contrôler vos dépenses et atteindre vos objectifs financiers en famille.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link to="/register" className="inline-flex items-center justify-center font-medium rounded-lg transition-colors bg-yellow-500 text-white hover:bg-yellow-600 px-6 py-3 text-lg font-semibold shadow-lg">
                  Commencer gratuitement
                </Link>
                <Link to="/features" className="inline-flex items-center justify-center font-medium rounded-lg transition-colors border border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-3 text-lg font-semibold">
                  En savoir plus
                </Link>
              </div>
              <div className="flex gap-6 mt-6 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">✓</span>
                  <span className="text-sm text-white/75">Sans carte bancaire</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">✓</span>
                  <span className="text-sm text-white/75">Annulation gratuite</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 hidden lg:flex justify-center pb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg" style={{ maxWidth: 480, width: '100%', transform: 'perspective(1000px) rotateY(-5deg)' }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-yellow-500/25 rounded-full flex items-center justify-center" style={{ width: 48, height: 48 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-500"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div>
                    <div className="font-semibold text-white">Bienvenue, Famille MADINDA</div>
                    <div className="text-white/60 text-sm">Solde disponible</div>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-emerald-500/25 text-emerald-500">En ligne</span>
                  </div>
                </div>
                <div className="text-5xl font-bold mb-6 text-white">2 450 000 <span className="text-lg font-normal text-white/70">F CFA</span></div>
                <div className="flex gap-2 mb-6" style={{ height: 90 }}>
                  {[45, 70, 55, 85, 60, 40, 75, 65, 50, 80, 55, 70].map((h, i) => (
                    <div key={i} className="flex-1 bg-yellow-500/30 rounded" style={{ height: `${h}%`, alignSelf: 'flex-end' }} />
                  ))}
                </div>
                <div className="flex justify-between pt-4 border-t border-white/20">
                  <div><div className="font-bold text-emerald-500">+850 000 F</div><div className="text-sm text-white/60">Revenus</div></div>
                  <div><div className="font-bold text-red-500">-420 000 F</div><div className="text-sm text-white/60">Dépenses</div></div>
                  <div><div className="font-bold text-yellow-500">430 000 F</div><div className="text-sm text-white/60">Épargne</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full" style={{ height: 80, background: 'linear-gradient(to top, var(--bs-body-bg), transparent)' }} />
      </section>

      <section className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <span className="inline-block bg-indigo-500/10 text-indigo-500 rounded-full px-4 py-1 mb-4 text-base font-semibold">Fonctionnalités</span>
            <h2 className="text-5xl font-bold">Tout ce dont vous avez besoin</h2>
            <p className="text-lg text-gray-500 mx-auto" style={{ maxWidth: 600 }}>
              Une suite complète d'outils pour gérer efficacement les finances de votre famille.
            </p>
          </div>
          <div className="flex flex-wrap gap-6">
            {features.map((f, i) => (
              <div key={i} className="md:w-1/2 lg:w-1/3">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm border-0 h-full p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <div className="p-6">
                    <div className="text-4xl mb-4">{f.icon}</div>
                    <h5 className="text-lg font-bold">{f.title}</h5>
                    <p className="text-gray-500 text-sm">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <span className="inline-block bg-indigo-500/10 text-indigo-500 rounded-full px-4 py-1 mb-4 text-base font-semibold">Comment ça marche</span>
            <h2 className="text-5xl font-bold">Commencez en 3 étapes</h2>
            <p className="text-lg text-gray-500 mx-auto" style={{ maxWidth: 600 }}>
              MADINDA est conçu pour être simple à prendre en main.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 justify-center relative">
            {steps.map((s, i) => (
              <div key={i} className="md:w-1/3">
                <div className="text-center position-relative">
                  <div className="bg-indigo-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ width: 80, height: 80, fontSize: '1.75rem', fontWeight: 800 }}>
                    {s.num}
                  </div>
                  <h5 className="font-bold">{s.title}</h5>
                  <p className="text-gray-500 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 stats-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-6 text-center">
            {stats.map((s, i) => (
              <div key={i} className="w-1/2 lg:w-1/4">
                <div className="font-bold" style={{ fontSize: '2.5rem' }}>{s.value}</div>
                <div className="text-white/75 text-sm uppercase" style={{ letterSpacing: '0.05em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <span className="inline-block bg-indigo-500/10 text-indigo-500 rounded-full px-4 py-1 mb-4 text-base font-semibold">Témoignages</span>
            <h2 className="text-5xl font-bold">Ce que disent nos utilisateurs</h2>
          </div>
          <div className="flex flex-wrap gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="md:w-1/3">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm border-0 h-full p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`${t.color} text-white rounded-full flex items-center justify-center font-bold`} style={{ width: 50, height: 50, fontSize: '1.1rem' }}>
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{t.name}</div>
                      <div className="text-gray-500" style={{ fontSize: '0.8rem' }}>{t.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mb-0 leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-5xl font-bold mb-4">Prêt à prendre le contrôle de vos finances ?</h2>
          <p className="text-lg text-gray-500 mx-auto mb-6" style={{ maxWidth: 600 }}>
            Rejoignez des milliers de familles qui gèrent déjà leur budget avec MADINDA.
          </p>
          <Link to="/register" className="inline-flex items-center justify-center font-medium rounded-lg transition-colors bg-indigo-500 text-white hover:bg-indigo-600 px-12 py-4 text-lg font-semibold shadow-lg">
            Commencer gratuitement →
          </Link>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ maxWidth: 700 }}>
          <div className="text-center mb-12">
            <span className="inline-block bg-indigo-500/10 text-indigo-500 rounded-full px-4 py-1 mb-4 text-base font-semibold">FAQ</span>
            <h2 className="text-5xl font-bold">Questions fréquentes</h2>
          </div>
          <div className="flex flex-col gap-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm border-0" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <button
                  className="flex items-center justify-between w-full border-0 bg-transparent p-6 text-start font-semibold"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  style={{ cursor: 'pointer' }}
                >
                  <span>{faq.q}</span>
                  <span style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-gray-500 text-sm leading-relaxed border-t pt-4">
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
