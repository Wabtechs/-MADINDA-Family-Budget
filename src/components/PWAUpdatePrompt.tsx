import { useState, useEffect, useCallback } from 'react';

type SWRegistration = {
  waiting: ServiceWorker | null;
  update: () => void;
};

export default function PWAUpdatePrompt() {
  const [registration, setRegistration] = useState<SWRegistration | null>(null);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        if (reg.waiting) {
          setRegistration({ waiting: reg.waiting, update: () => reg.waiting?.postMessage({ type: 'SKIP_WAITING' }) });
        }
      });

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }, []);

  const handleUpdateApp = useCallback(() => {
    registration?.update();
  }, [registration]);

  if (registration) {
    return (
      <div className="fixed bottom-0 left-0 right-0 p-4" style={{ zIndex: 9999 }}>
        <div className="bg-sky-50 text-sky-800 shadow-lg border-0 flex items-center justify-between mx-auto mb-0" style={{ maxWidth: 500 }}>
          <span className="text-sm">
            <strong>Mise à jour disponible</strong> &mdash; Une nouvelle version de MADINDA est prête.
          </span>
          <button className="inline-flex items-center justify-center font-medium rounded-lg transition-colors px-3 py-1.5 text-sm bg-emerald-500 text-white hover:bg-emerald-600 shrink-0 ml-4" onClick={handleUpdateApp}>
            Mettre à jour
          </button>
        </div>
      </div>
    );
  }

  if (!online) {
    return (
      <div className="fixed top-0 left-0 right-0 p-2" style={{ zIndex: 9999 }}>
        <div className="bg-amber-50 text-amber-800 text-center py-2 mb-0 rounded-none border-0 text-sm">
          <strong>Mode hors-ligne</strong> &mdash; Vous naviguez avec les données en cache.
        </div>
      </div>
    );
  }

  return null;
}
