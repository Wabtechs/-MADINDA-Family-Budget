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
  income: 'bg-emerald-500',
  expense: 'bg-red-500',
  budget: 'bg-yellow-500',
  goal: 'bg-indigo-500',
  debt: 'bg-blue-500',
  system: 'bg-gray-500',
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-0">Notifications</h1>
          <p className="text-gray-500 text-sm mb-0">
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

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>}

      {notifications.length === 0 && !error ? (
        <div className="bg-white rounded-xl border-0 shadow-sm">
          <div className="p-6 text-center py-12">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            <p className="text-gray-500 mb-0">Aucune notification pour le moment.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border-0 shadow-sm">
          <div className="divide-y divide-gray-100">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`px-4 py-3 flex gap-3 hover:bg-gray-50 cursor-pointer ${!n.is_read ? 'bg-indigo-50' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => !n.is_read && handleMarkAsRead(n.id)}
              >
                <div className={`rounded-full flex items-center justify-center shrink-0 ${typeColors[n.type] ? typeColors[n.type] + '/10' : 'bg-gray-500/10'}`} style={{ width: 40, height: 40 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${typeColors[n.type] ? 'text-white' : 'text-gray-500'}`}>
                    <path d={typeIcons[n.type] || typeIcons.system} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="font-semibold text-sm">
                      {!n.is_read && <span className="inline-block bg-indigo-500 rounded-full mr-1" style={{ width: 8, height: 8 }} />}
                      {n.title}
                    </div>
                    <div className="text-gray-500" style={{ fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                      {new Date(n.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-0 mt-1">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
