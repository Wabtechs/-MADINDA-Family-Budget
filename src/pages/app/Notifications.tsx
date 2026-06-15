import { useEffect, useState } from 'react';
import { notificationApi } from '../../services/api';
import type { Notification } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';

const typeIcons: Record<string, string> = {
  income: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  expense: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  budget: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  goal: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  debt: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  system: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
};

const typeColors: Record<string, string> = {
  income: 'bg-success',
  expense: 'bg-danger',
  budget: 'bg-warning',
  goal: 'bg-primary',
  debt: 'bg-info',
  system: 'bg-secondary',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await notificationApi.list();
      setNotifications(Array.isArray(data) ? data : data.data || data.notifications || []);
    } catch {
      setError('Erreur lors du chargement.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch {
      // silent
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAll(true);
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {
      // silent
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) return <LoadingSpinner size="lg" text="Chargement des notifications..." />;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h3 fw-bold mb-0">Notifications</h1>
          <p className="text-secondary small mb-0">
            {unreadCount > 0 ? (
              <span>{unreadCount} non lue(s) sur {notifications.length}</span>
            ) : (
              <span>{notifications.length} notification(s)</span>
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" onClick={handleMarkAllAsRead} loading={markingAll}>
            Tout marquer comme lu
          </Button>
        )}
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      {notifications.length === 0 && !error ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            <p className="text-secondary mb-0">Aucune notification pour le moment.</p>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="list-group list-group-flush">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`list-group-item list-group-item-action d-flex gap-3 px-4 py-3 border-0 border-bottom ${!n.is_read ? 'bg-primary bg-opacity-10' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => !n.is_read && handleMarkAsRead(n.id)}
              >
                <div className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${typeColors[n.type] || 'bg-secondary'} bg-opacity-10`} style={{ width: 40, height: 40 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${typeColors[n.type] ? 'text-white' : 'text-secondary'}`}>
                    <path d={typeIcons[n.type] || typeIcons.system} />
                  </svg>
                </div>
                <div className="flex-grow-1 min-w-0">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="fw-semibold small">
                      {!n.is_read && <span className="d-inline-block bg-primary rounded-circle me-1" style={{ width: 8, height: 8 }} />}
                      {n.title}
                    </div>
                    <div className="text-secondary" style={{ fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                      {new Date(n.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <p className="small text-secondary mb-0 mt-1">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
