/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { expenseApi, familyApi, budgetApi } from '../../services/api';
import type { DashboardStats, Family, Budget } from '../../types';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateFamily, setShowCreateFamily] = useState(false);
  const [familyName, setFamilyName] = useState('');

  const loadData = async () => {
    try {
      const { data: families } = await familyApi.list();
      if (families.length > 0) {
        setFamily(families[0]);
        const [statsRes, budgetsRes] = await Promise.all([
          expenseApi.stats(families[0].id),
          budgetApi.list(families[0].id),
        ]);
        setStats(statsRes.data);
        setBudgets(budgetsRes.data);
      }
    } catch {
      // Silently handle - data stays at initial state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createFamily = async () => {
    if (!familyName.trim()) return;
    try {
      const { data } = await familyApi.create({ nom_famille: familyName });
      setFamily(data);
      setShowCreateFamily(false);
      setFamilyName('');
      loadData();
    } catch {
      // Silently handle
    }
  };

  if (loading) {
    return <div className="page-loading"><div className="loader-spinner" /><span>Chargement...</span></div>;
  }

  if (!family) {
    return (
      <div className="page-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
        <h2>Bienvenue sur MADINDA</h2>
        <p>Créez votre famille pour commencer à gérer votre budget.</p>

        {!showCreateFamily ? (
          <button className="btn btn-primary" onClick={() => setShowCreateFamily(true)}>
            Créer ma famille
          </button>
        ) : (
          <div className="create-family-form">
            <input
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="Nom de la famille"
              className="create-family-input"
            />
            <button className="btn btn-primary" onClick={createFamily}>
              Créer
            </button>
          </div>
        )}
      </div>
    );
  }

  const budgetTotal = budgets.reduce((s, b) => s + Number(b.montant), 0);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Bonjour, {user?.nom}</h1>
        <p className="dashboard-family">{family.nom_famille}</p>
      </div>

      <div className="stats-cards">
        <div className="stat-card stat-card-primary">
          <div className="stat-card-label">Budget total</div>
          <div className="stat-card-value">{budgetTotal.toLocaleString()} $</div>
        </div>
        <div className="stat-card stat-card-danger">
          <div className="stat-card-label">Dépenses du mois</div>
          <div className="stat-card-value">{Number(stats?.total_expenses || 0).toLocaleString()} $</div>
        </div>
        <div className="stat-card stat-card-success">
          <div className="stat-card-label">Restant</div>
          <div className="stat-card-value">{Number(stats?.remaining || 0).toLocaleString()} $</div>
        </div>
      </div>

      {stats && stats.expenses_by_category.length > 0 && (
        <div className="dashboard-section">
          <h2>Dépenses par catégorie</h2>
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

      {stats && stats.monthly_evolution.length > 0 && (
        <div className="dashboard-section">
          <h2>Évolution mensuelle</h2>
          <div className="monthly-chart">
            {stats.monthly_evolution.map((m) => (
              <div key={m.month} className="monthly-bar-col">
                <div className="monthly-bar" style={{ height: `${Math.min(100, (Number(m.total) / (stats.total_expenses || 1)) * 100)}%` }} />
                <span className="monthly-bar-value">{Number(m.total).toLocaleString()} $</span>
                <span className="monthly-bar-label">{m.month}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Dernières dépenses</h2>
          <Link to="/app/expenses" className="section-link">Voir tout</Link>
        </div>
        {stats?.recent_expenses && stats.recent_expenses.length > 0 ? (
          <div className="recent-expenses">
            {stats.recent_expenses.map((exp) => (
              <div key={exp.id} className="recent-expense-item">
                <div className="recent-expense-icon">{exp.category_icone}</div>
                <div className="recent-expense-info">
                  <span className="recent-expense-category">{exp.category_nom}</span>
                  <span className="recent-expense-desc">{exp.description || exp.user_nom}</span>
                </div>
                <span className="recent-expense-amount">-{Number(exp.montant).toLocaleString()} $</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">Aucune dépense récente.</p>
        )}
      </div>

      <Link to="/app/expenses?add=1" className="fab">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </Link>
    </div>
  );
}
