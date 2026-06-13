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
      <div className="text-center py-5">
        <h2 className="fw-bold mb-2">Bienvenue sur MADINDA</h2>
        <p className="text-secondary mb-4">Créez votre entité pour commencer à gérer votre budget.</p>
        <Link to="/app/profile" className="btn btn-primary">Configurer mon compte</Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <p className="text-danger mb-4">{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>Réessayer</button>
      </div>
    );
  }

  const pieData = (data?.topCategories || []).map((c) => ({ name: c.category, value: c.total }));

  return (
    <div>
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1">Bonjour, {user?.nom}</h1>
        <p className="text-secondary small">{currentEntity.name}</p>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center py-3">
              <div className="small text-secondary text-uppercase small fw-semibold">Solde actuel</div>
              <div className="fs-3 fw-bold text-dark">&euro;{(data?.currentBalance ?? 0).toFixed(2)}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm bg-primary text-white h-100">
            <div className="card-body text-center py-3">
              <div className="small text-white text-opacity-75 text-uppercase fw-semibold">Revenus du mois</div>
              <div className="fs-3 fw-bold">&euro;{(data?.monthlyIncome ?? 0).toFixed(2)}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm bg-danger text-white h-100">
            <div className="card-body text-center py-3">
              <div className="small text-white text-opacity-75 text-uppercase fw-semibold">D&eacute;penses du mois</div>
              <div className="fs-3 fw-bold">&euro;{(data?.monthlyExpense ?? 0).toFixed(2)}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className={`card border-0 shadow-sm h-100 ${(data?.monthlyProfit ?? 0) >= 0 ? 'bg-success' : 'bg-danger'} text-white`}>
            <div className="card-body text-center py-3">
              <div className="small text-white text-opacity-75 text-uppercase fw-semibold">B&eacute;n&eacute;fice/Perte</div>
              <div className="fs-3 fw-bold">&euro;{(data?.monthlyProfit ?? 0).toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Revenus vs D&eacute;penses (6 mois)</h5>
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
                <p className="text-secondary text-center py-5 mb-0">Aucune donn&eacute;e mensuelle.</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">R&eacute;partition des d&eacute;penses</h5>
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
                <p className="text-secondary text-center py-5 mb-0">Aucune d&eacute;pense.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Budget Status + Recent Transactions */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">&Eacute;tat des budgets</h5>
              {(data?.budgetStatus?.length ?? 0) > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {data?.budgetStatus?.map((b, i) => {
                    const total = b.total || 0;
                    const used = b.used || 0;
                    const pct = total > 0 ? Math.round((used / total) * 100) : 0;
                    const barColor = pct > 100 ? 'bg-danger' : pct >= 80 ? 'bg-warning' : 'bg-success';
                    return (
                      <div key={i}>
                        <div className="d-flex justify-content-between small mb-1">
                          <span className="fw-semibold">Budget {i + 1}</span>
                          <span>&euro;{used.toFixed(0)} / &euro;{total.toFixed(0)} ({pct}%)</span>
                        </div>
                        <div className="progress" style={{ height: 8 }}>
                          <div className={`progress-bar ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-secondary mb-0">Aucun budget d&eacute;fini.</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Transactions r&eacute;centes</h5>
              {(data?.recentTransactions?.length ?? 0) > 0 ? (
                <div className="list-group list-group-flush">
                  {data?.recentTransactions?.slice(0, 10).map((tx) => (
                    <div key={tx.id} className="list-group-item d-flex align-items-center gap-3 px-0 border-0 border-bottom">
                      <div className={`rounded-circle d-flex align-items-center justify-content-center ${tx.type === 'income' ? 'bg-success bg-opacity-10' : tx.type === 'expense' ? 'bg-danger bg-opacity-10' : 'bg-info bg-opacity-10'}`} style={{ width: 36, height: 36 }}>
                        <span className={tx.type === 'income' ? 'text-success' : tx.type === 'expense' ? 'text-danger' : 'text-info'}>{tx.type === 'income' ? '+' : '-'}</span>
                      </div>
                      <div className="flex-grow-1 min-w-0">
                        <div className="fw-semibold small text-truncate">{tx.description || (tx.type === 'income' ? 'Revenu' : tx.type === 'expense' ? 'Dépense' : 'Transfert')}</div>
                        <div className="text-secondary" style={{ fontSize: '0.7rem' }}>{new Date(tx.date).toLocaleDateString('fr-FR')}</div>
                      </div>
                      <div className={`fw-bold small flex-shrink-0 ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}>
                        {tx.type === 'income' ? '+' : '-'}&euro;{tx.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-secondary mb-0">Aucune transaction r&eacute;cente.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
