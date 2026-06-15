import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useEntityStore from '../../store/entityStore';
import { dashboardApi } from '../../services/api';
import type { DashboardData } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#6366f1', '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6'];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { currentEntity } = useEntityStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentEntity) {
      setLoading(false);
      return;
    }
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const { data: res } = await dashboardApi.getDashboard(currentEntity.id);
        setData(res);
      } catch {
        setError('Impossible de charger le tableau de bord.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [currentEntity]);

  if (loading) return <LoadingSpinner size="lg" text="Chargement du tableau de bord..." />;

  if (!currentEntity) {
    return (
      <div className="text-center py-12">
        <h2 className="font-bold mb-2">Bienvenue sur MADINDA</h2>
        <p className="text-gray-500 mb-6">Créez votre entité pour commencer à gérer votre budget.</p>
        <Link to="/app/profile" className="inline-flex items-center justify-center font-medium rounded-lg transition-colors bg-indigo-500 text-white hover:bg-indigo-600 px-4 py-2">Configurer mon compte</Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-6">{error}</p>
        <button className="inline-flex items-center justify-center font-medium rounded-lg transition-colors bg-indigo-500 text-white hover:bg-indigo-600 px-4 py-2" onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  const pieData = (data?.topCategories || []).map((c) => ({ name: c.category, value: c.total }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Bonjour, {user?.nom}</h1>
        <p className="text-gray-500 text-sm">{currentEntity.name}</p>
      </div>

      {/* Summary Cards */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="w-1/2 md:w-1/4">
          <div className="bg-white rounded-xl border-0 shadow-sm h-full">
            <div className="p-6 text-center">
              <div className="text-sm text-gray-500 uppercase font-semibold">Solde actuel</div>
              <div className="text-2xl font-bold text-gray-900">&euro;{(data?.currentBalance ?? 0).toFixed(2)}</div>
            </div>
          </div>
        </div>
        <div className="w-1/2 md:w-1/4">
          <div className="bg-indigo-500 text-white rounded-xl border-0 shadow-sm h-full">
            <div className="p-6 text-center">
              <div className="text-white/75 text-sm uppercase font-semibold">Revenus du mois</div>
              <div className="text-2xl font-bold">&euro;{(data?.monthlyIncome ?? 0).toFixed(2)}</div>
            </div>
          </div>
        </div>
        <div className="w-1/2 md:w-1/4">
          <div className="bg-red-500 text-white rounded-xl border-0 shadow-sm h-full">
            <div className="p-6 text-center">
              <div className="text-white/75 text-sm uppercase font-semibold">Dépenses du mois</div>
              <div className="text-2xl font-bold">&euro;{(data?.monthlyExpense ?? 0).toFixed(2)}</div>
            </div>
          </div>
        </div>
        <div className="w-1/2 md:w-1/4">
          <div className={`${(data?.monthlyProfit ?? 0) >= 0 ? 'bg-emerald-500' : 'bg-red-500'} text-white rounded-xl border-0 shadow-sm h-full`}>
            <div className="p-6 text-center">
              <div className="text-white/75 text-sm uppercase font-semibold">Bénéfice/Perte</div>
              <div className="text-2xl font-bold">&euro;{(data?.monthlyProfit ?? 0).toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="flex flex-wrap gap-6 mb-6">
        <div className="lg:w-7/12">
          <div className="bg-white rounded-xl border-0 shadow-sm h-full">
            <div className="p-6">
              <h5 className="font-bold mb-4">Revenus vs Dépenses (6 mois)</h5>
              {(data?.monthlyComparison?.length ?? 0) > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data?.monthlyComparison || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="income" name="Revenus" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" name="Dépenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-12 mb-0">Aucune donnée mensuelle.</p>
              )}
            </div>
          </div>
        </div>
        <div className="lg:w-5/12">
          <div className="bg-white rounded-xl border-0 shadow-sm h-full">
            <div className="p-6">
              <h5 className="font-bold mb-4">Répartition des dépenses</h5>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" label={({ name, percent }: any) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}>
                      {pieData.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-12 mb-0">Aucune dépense.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Budget Status + Recent Transactions */}
      <div className="flex flex-wrap gap-6">
        <div className="lg:w-1/2">
          <div className="bg-white rounded-xl border-0 shadow-sm">
            <div className="p-6">
              <h5 className="font-bold mb-4">État des budgets</h5>
              {(data?.budgetStatus?.length ?? 0) > 0 ? (
                <div className="flex flex-col gap-4">
                  {data?.budgetStatus?.map((b, i) => {
                    const total = b.total || 0;
                    const used = b.used || 0;
                    const pct = total > 0 ? Math.round((used / total) * 100) : 0;
                    const barColor = pct > 100 ? 'bg-red-500' : pct >= 80 ? 'bg-yellow-500' : 'bg-emerald-500';
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-semibold">Budget {i + 1}</span>
                          <span>&euro;{used.toFixed(0)} / &euro;{total.toFixed(0)} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden" style={{ height: 8 }}>
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 mb-0">Aucun budget défini.</p>
              )}
            </div>
          </div>
        </div>
        <div className="lg:w-1/2">
          <div className="bg-white rounded-xl border-0 shadow-sm">
            <div className="p-6">
              <h5 className="font-bold mb-4">Transactions récentes</h5>
              {(data?.recentTransactions?.length ?? 0) > 0 ? (
                <div className="divide-y divide-gray-100">
                  {data?.recentTransactions?.slice(0, 10).map((tx) => (
                    <div key={tx.id} className="px-4 py-3 flex items-center gap-3">
                      <div className={`rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-100' : tx.type === 'expense' ? 'bg-red-100' : 'bg-blue-100'}`} style={{ width: 36, height: 36 }}>
                        <span className={tx.type === 'income' ? 'text-emerald-500' : tx.type === 'expense' ? 'text-red-500' : 'text-blue-500'}>{tx.type === 'income' ? '+' : '-'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{tx.description || (tx.type === 'income' ? 'Revenu' : tx.type === 'expense' ? 'Dépense' : 'Transfert')}</div>
                        <div className="text-gray-500" style={{ fontSize: '0.7rem' }}>{new Date(tx.date).toLocaleDateString('fr-FR')}</div>
                      </div>
                      <div className={`font-bold text-sm shrink-0 ${tx.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                        {tx.type === 'income' ? '+' : '-'}&euro;{tx.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mb-0">Aucune transaction récente.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
