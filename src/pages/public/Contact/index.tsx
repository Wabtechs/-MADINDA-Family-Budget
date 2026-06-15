const contactInfo = [
  { icon: '✉️', title: 'Email', value: 'contact@madinda.app', href: 'mailto:contact@madinda.app' },
  { icon: '📞', title: 'Téléphone', value: '+243 800 000 000', href: 'tel:+243800000000' },
  { icon: '📍', title: 'Adresse', value: 'Kinshasa, République Démocratique du Congo', href: null },
];

const socialLinks = [
  { name: 'Facebook', icon: 'f', bg: 'bg-facebook' },
  { name: 'Twitter', icon: '𝕏', bg: 'bg-gray-900' },
  { name: 'LinkedIn', icon: 'in', bg: 'bg-indigo-500' },
  { name: 'Instagram', icon: '📷', bg: 'gradient-purple-pink' },
];

export default function ContactPage() {
  return (
    <>
      <section className="hero-gradient text-white py-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 25% 75%, rgba(255,255,255,0.15) 0%, transparent 50%)',
        }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative py-12 text-center">
          <span className="inline-block bg-white/10 text-white rounded-full px-4 py-1 mb-4 text-base font-semibold">Contact</span>
          <h1 className="text-6xl font-bold mb-4">Contactez-nous</h1>
          <p className="text-lg text-white/75 mx-auto" style={{ maxWidth: 600 }}>
            Une question ? Une suggestion ? Notre équipe est là pour vous aider.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-12">
            <div className="lg:w-7/12">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm border-0 p-6" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 className="font-bold mb-1">Envoyez-nous un message</h3>
                <p className="text-gray-500 text-sm mb-6">Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.</p>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="flex flex-wrap gap-4">
                    <div className="md:w-1/2">
                      <label className="block text-sm font-semibold mb-1">Nom complet</label>
                      <input type="text" className="block w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none px-4 py-3 text-base" placeholder="Votre nom" />
                    </div>
                    <div className="md:w-1/2">
                      <label className="block text-sm font-semibold mb-1">Email</label>
                      <input type="email" className="block w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none px-4 py-3 text-base" placeholder="votre@email.com" />
                    </div>
                    <div className="w-full">
                      <label className="block text-sm font-semibold mb-1">Sujet</label>
                      <select className="block w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none px-4 py-3 text-base">
                        <option value="">Sélectionnez un sujet</option>
                        <option value="support">Support technique</option>
                        <option value="commercial">Question commerciale</option>
                        <option value="suggestion">Suggestion</option>
                        <option value="bug">Signaler un bug</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                    <div className="w-full">
                      <label className="block text-sm font-semibold mb-1">Message</label>
                      <textarea className="block w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none px-4 py-3 text-base" rows={6} placeholder="Décrivez votre question ou votre suggestion..." />
                    </div>
                    <div className="w-full">
                      <button type="submit" className="inline-flex items-center justify-center font-medium rounded-lg transition-colors bg-indigo-500 text-white hover:bg-indigo-600 px-12 py-4 text-lg font-semibold">
                        Envoyer le message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:w-5/12">
              <div className="flex flex-col gap-6 mb-6">
                {contactInfo.map((info, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm border-0 p-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div className="flex items-center gap-4">
                      <div className="bg-indigo-500/10 text-indigo-500 rounded-md flex items-center justify-center shrink-0" style={{ width: 48, height: 48, fontSize: '1.3rem' }}>
                        {info.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{info.title}</div>
                        {info.href ? (
                          <a href={info.href} className="no-underline text-gray-900 text-sm">{info.value}</a>
                        ) : (
                          <span className="text-gray-500 text-sm">{info.value}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm border-0 p-6" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h6 className="font-bold mb-4">Suivez-nous</h6>
                <div className="flex gap-2">
                  {socialLinks.map((s, i) => (
                    <a
                      key={i}
                      href="#"
                      className={`${s.bg} text-white rounded-full flex items-center justify-center no-underline`}
                      style={{ width: 40, height: 40, fontSize: '0.85rem', fontWeight: 700 }}
                      aria-label={s.name}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm border-0 p-6 mt-6" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h6 className="font-bold mb-4">Notre localisation</h6>
                <div className="bg-gray-500/10 rounded-lg flex items-center justify-center" style={{ height: 200 }}>
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">🗺️</div>
                    <div className="text-sm">Kinshasa, RDC</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <h2 className="text-5xl font-bold mb-4">Prêt à commencer ?</h2>
          <p className="text-lg text-gray-500 mx-auto mb-6" style={{ maxWidth: 500 }}>
            Créez votre compte gratuitement et rejoignez des milliers de familles.
          </p>
          <a href="/register" className="inline-flex items-center justify-center font-medium rounded-lg transition-colors bg-indigo-500 text-white hover:bg-indigo-600 px-12 py-4 text-lg font-semibold shadow-lg">
            Créer un compte gratuit
          </a>
        </div>
      </section>
    </>
  );
}
