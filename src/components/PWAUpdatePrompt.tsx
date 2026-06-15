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

      const handleUpdateFound = (event: Event) => {
        const target = event.target as ServiceWorkerRegistration;
        if (target.installing) {
          target.installing.addEventListener('statechange', () => {
            if (target.waiting) {
              setRegistration({ waiting: target.waiting, update: () => target.waiting?.postMessage({ type: 'SKIP_WAITING' }) });
            }
          });
        }
      };

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
      <div className="position-fixed bottom-0 start-0 end-0 p-3 z-3" style={{ zIndex: 9999 }}>
        <div className="alert alert-info shadow-lg border-0 d-flex align-items-center justify-content-between mx-auto mb-0" style={{ maxWidth: 500 }}>
          <span className="small">
            <strong>Mise à jour disponible</strong> &mdash; Une nouvelle version de MADINDA est prête.
          </span>
          <button className="btn btn-success btn-sm flex-shrink-0 ms-3" onClick={handleUpdateApp}>
            Mettre à jour
          </button>
        </div>
      </div>
    );
  }

  if (!online) {
    return (
      <div className="position-fixed top-0 start-0 end-0 p-2 z-3" style={{ zIndex: 9999 }}>
        <div className="alert alert-warning text-center py-2 mb-0 rounded-0 border-0 small">
          <strong>Mode hors-ligne</strong> &mdash; Vous naviguez avec les données en cache.
        </div>
      </div>
    );
  }

  return null;
}
