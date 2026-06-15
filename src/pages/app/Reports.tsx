import { useEffect, useState } from 'react';
import useEntityStore from '../../store/entityStore';
import { reportApi } from '../../services/api';
import type { MonthlyReport } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#6366f1', '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6'];

export default function ReportsPage() {
  const { currentEntity } = useEntityStore();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [monthlyData, setMonthlyData] = useState<MonthlyReport[]>([]);
  const [categoryData, setCategoryData] = useState<{ category: string; total: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    if (!currentEntity) return;
    setLoading(true);
    setError('');
    try {
      const [monthlyRes, catRes] = await Promise.all([
        reportApi.monthly({ entity_id: currentEntity.id, year }),
        reportApi.categories({ entity_id: currentEntity.id, start_date: `${year}-01-01`, end_date: `${year}-12-31` }),
      ]);
      setMonthlyData(Array.isArray(monthlyRes.data) ? monthlyRes.data : monthlyRes.data.data || monthlyRes.data.reports || []);
      const cats = Array.isArray(catRes.data) ? catRes.data : catRes.data.data || catRes.data.categories || [];
      setCategoryData(cats);
    } catch {
      setError('Erreur lors du chargement des rapports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [currentEntity, year]);

  const totalIncome = monthlyData.reduce((s, m) => s + m.income, 0);
  const totalExpense = monthlyData.reduce((s, m) => s + m.expense, 0);
  const totalProfit = monthlyData.reduce((s, m) => s + m.profit, 0);

  if (loading) return <LoadingSpinner size="lg" text="Chargement des rapports..." />;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h3 fw-bold mb-0">Rapports et analyses</h1>
          <p className="text-secondary small mb-0">Ann&eacute;e {year}</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <select className="form-select form-select-sm" style={{ width: 120 }} value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      {/* Annual Summary */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-primary text-white">
            <div className="card-body text-center py-3">
              <div className="text-white/75 small text-uppercase fw-semibold">Revenus annuels</div>
              <div className="fs-3 fw-bold">&euro;{totalIncome.toFixed(2)}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-danger text-white">
            <div className="card-body text-center py-3">
              <div className="text-white/75 small text-uppercase fw-semibold">D&eacute;penses annuelles</div>
              <div className="fs-3 fw-bold">&euro;{totalExpense.toFixed(2)}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className={`card border-0 shadow-sm text-white ${totalProfit >= 0 ? 'bg-success' : 'bg-danger'}`}>
            <div className="card-body text-center py-3">
              <div className="text-white/75 small text-uppercase fw-semibold">R&eacute;sultat net</div>
              <div className="fs-3 fw-bold">&euro;{totalProfit.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Bar Chart */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">&Eacute;volution mensuelle ({year})</h5>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="income" name="Revenus" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Dépenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Résultat" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-secondary text-center py-5 mb-0">Aucune donn&eacute;e pour cette ann&eacute;e.</p>
          )}
        </div>
      </div>

      {/* Category Analysis */}
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Analyse par cat&eacute;gorie</h5>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} dataKey="total" nameKey="category" label={({ name, percent }: any) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}>
                      {categoryData.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-secondary text-center py-5 mb-0">Aucune donn&eacute;e.</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="fw-bold mb-3">D&eacute;tail par cat&eacute;gorie</h5>
              {categoryData.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm mb-0">
                    <thead>
                      <tr>
                        <th>Cat&eacute;gorie</th>
                        <th className="text-end">Montant</th>
                        <th className="text-end">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryData.map((cat, idx) => {
                        const pct = totalExpense > 0 ? ((cat.total / totalExpense) * 100) : 0;
                        return (
                          <tr key={idx}>
                            <td>
                              <span className="d-inline-block rounded-circle me-2" style={{ width: 10, height: 10, backgroundColor: COLORS[idx % COLORS.length] }} />
                              {cat.category}
                            </td>
                            <td className="text-end fw-semibold">&euro;{cat.total.toFixed(2)}</td>
                            <td className="text-end">{pct.toFixed(1)}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-secondary text-center py-5 mb-0">Aucune donn&eacute;e.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="d-flex gap-2 mt-4">
        <Button variant="secondary" onClick={() => window.print()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
          Imprimer
        </Button>
        <Button variant="secondary" onClick={() => {}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          Exporter PDF
        </Button>
        <Button variant="secondary" onClick={() => {}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
          Exporter Excel
        </Button>
      </div>
    </div>
  );
}
