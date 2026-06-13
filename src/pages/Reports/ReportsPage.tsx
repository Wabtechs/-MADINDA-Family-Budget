/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { expenseApi, familyApi } from '../../services/api';
import type { DashboardStats, Family } from '../../types';

export default function ReportsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const { data: families } = await familyApi.list();
      if (families.length > 0) {
        setFamily(families[0]);
        const { data } = await expenseApi.stats(families[0].id);
        setStats(data);
      }
    } catch {
      // Silently handle - data stays at initial state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) return <div className="page-loading"><div className="loader-spinner" /><span>Chargement...</span></div>;
  if (!family) return <div className="page-empty"><p>Créez d'abord une famille.</p></div>;
  if (!stats) return <div className="page-empty"><p>Aucune donnée disponible.</p></div>;

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Statistiques</h1>
      </div>

      <div className="reports-summary">
        <div className="report-summary-card">
          <span className="report-summary-label">Total dépenses</span>
          <span className="report-summary-value">{Number(stats.total_expenses).toLocaleString()} $</span>
        </div>
        <div className="report-summary-card">
          <span className="report-summary-label">Budget total</span>
          <span className="report-summary-value">{Number(stats.total_budget).toLocaleString()} $</span>
        </div>
        <div className="report-summary-card">
          <span className="report-summary-label">Taux d'utilisation</span>
          <span className="report-summary-value">
            {stats.total_budget > 0 ? Math.round((stats.total_expenses / stats.total_budget) * 100) : 0}%
          </span>
        </div>
      </div>

      {stats.expenses_by_category.length > 0 && (
        <div className="dashboard-section">
          <h2>Répartition par catégorie</h2>
          <div className="category-bars">
            {stats.expenses_by_category.map((cat) => {
              const pct = stats.total_expenses > 0
                ? (Number(cat.total) / stats.total_expenses) * 100
                : 0;
              return (
                <div key={cat.category} className="category-bar-row">
                  <span className="category-bar-label">{cat.category}</span>
                  <div className="category-bar-track">
                    <div className="category-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="category-bar-value">{Number(cat.total).toLocaleString()} $</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {stats.monthly_evolution.length > 0 && (
        <div className="dashboard-section">
          <h2>Évolution mensuelle</h2>
          <div className="monthly-chart">
            {stats.monthly_evolution.map((m) => {
              const maxVal = Math.max(...stats.monthly_evolution.map((x) => Number(x.total)));
              const height = maxVal > 0 ? (Number(m.total) / maxVal) * 100 : 0;
              return (
                <div key={m.month} className="monthly-bar-col">
                  <div className="monthly-bar" style={{ height: `${height}%` }} />
                  <span className="monthly-bar-value">{Number(m.total).toLocaleString()} $</span>
                  <span className="monthly-bar-label">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
