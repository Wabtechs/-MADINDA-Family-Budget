/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { expenseApi, familyApi, categoryApi } from '../../services/api';
import type { Expense, Category, Family } from '../../types';

export default function ExpensesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [family, setFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(searchParams.get('add') === '1');
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [montant, setMontant] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const loadData = async () => {
    try {
      const { data: families } = await familyApi.list();
      if (families.length === 0) {
        setLoading(false);
        return;
      }
      setFamily(families[0]);
      const [expRes, catRes] = await Promise.all([
        expenseApi.list({ family_id: families[0].id }),
        categoryApi.list('expense'),
      ]);
      setExpenses(expRes.data);
      setCategories(catRes.data);
    } catch {
      // Silently handle - data stays at initial state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {
    setMontant('');
    setCategoryId('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setEditingId(null);
    setShowForm(false);
    setSearchParams({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!family) return;

    try {
      if (editingId) {
        await expenseApi.update(editingId, {
          montant: Number(montant),
          category_id: Number(categoryId),
          description,
          date,
        });
      } else {
        await expenseApi.create({
          family_id: family.id,
          category_id: Number(categoryId),
          montant: Number(montant),
          description,
          date,
        });
      }
      resetForm();
      loadData();
    } catch (err) {
      console.error('Failed to save expense', err);
    }
  };

  const handleEdit = (exp: Expense) => {
    setMontant(String(exp.montant));
    setCategoryId(String(exp.category_id));
    setDescription(exp.description || '');
    setDate(exp.date);
    setEditingId(exp.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette dépense ?')) return;
    try {
      await expenseApi.delete(id);
      loadData();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const getCategoryName = (id: number) => categories.find((c) => c.id === id)?.nom || 'Inconnue';
  const getCategoryIcon = (id: number) => categories.find((c) => c.id === id)?.icone || '📦';

  if (loading) return <div className="page-loading"><div className="loader-spinner" /><span>Chargement...</span></div>;

  return (
    <div className="expenses-page">
      <div className="page-header">
        <h1>Dépenses</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          + Ajouter
        </button>
      </div>

      {showForm && (
        <form className="expense-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Modifier' : 'Nouvelle'} dépense</h3>

          <div className="expense-form-grid">
            <div className="auth-field">
              <label>Montant ($)</label>
              <input type="number" step="0.01" min="0.01" value={montant} onChange={(e) => setMontant(e.target.value)} required />
            </div>
            <div className="auth-field">
              <label>Catégorie</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                <option value="">Sélectionner...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.icone} {c.nom}</option>
                ))}
              </select>
            </div>
            <div className="auth-field">
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="auth-field">
              <label>Description</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optionnelle" />
            </div>
          </div>

          <div className="expense-form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Mettre à jour' : 'Ajouter'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Annuler
            </button>
          </div>
        </form>
      )}

      {expenses.length === 0 ? (
        <div className="page-empty">
          <p>Aucune dépense pour le moment.</p>
        </div>
      ) : (
        <div className="expenses-list">
          {expenses.map((exp) => (
            <div key={exp.id} className="expense-item">
              <div className="expense-item-icon">{getCategoryIcon(exp.category_id)}</div>
              <div className="expense-item-info">
                <span className="expense-item-category">{getCategoryName(exp.category_id)}</span>
                <span className="expense-item-desc">{exp.description || '—'}</span>
                <span className="expense-item-date">{new Date(exp.date).toLocaleDateString('fr-FR')}</span>
              </div>
              <div className="expense-item-amount">-{Number(exp.montant).toLocaleString()} $</div>
              <div className="expense-item-actions">
                <button onClick={() => handleEdit(exp)} className="expense-action-btn" title="Modifier">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                </button>
                <button onClick={() => handleDelete(exp.id)} className="expense-action-btn danger" title="Supprimer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
