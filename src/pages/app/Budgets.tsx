import { useEffect, useState } from 'react';
import useEntityStore from '../../store/entityStore';
import { budgetApi, categoryApi } from '../../services/api';
import type { Budget, Category } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const budgetSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  category_id: z.string().optional(),
  amount: z.string().min(1, 'Le montant est requis'),
  period: z.enum(['weekly', 'monthly', 'yearly', 'custom']),
  start_date: z.string().min(1, 'La date de début est requise'),
  end_date: z.string().min(1, 'La date de fin est requise'),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

const periodLabels: Record<string, string> = {
  weekly: 'Hebdomadaire',
  monthly: 'Mensuel',
  yearly: 'Annuel',
  custom: 'Personnalisé',
};

export default function BudgetsPage() {
  const { currentEntity } = useEntityStore();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: { name: '', category_id: '', amount: '', period: 'monthly', start_date: '', end_date: '' },
  });

  const fetchData = async () => {
    if (!currentEntity) return;
    setLoading(true);
    setError('');
    try {
      const [budRes, catRes] = await Promise.all([
        budgetApi.list(currentEntity.id),
        categoryApi.list({ entity_id: currentEntity.id }),
      ]);
      setBudgets(Array.isArray(budRes.data) ? budRes.data : budRes.data.data || budRes.data.budgets || []);
      setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.data || catRes.data.categories || []);
    } catch {
      setError('Erreur lors du chargement.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [currentEntity]);

  const openCreate = () => {
    setEditing(null);
    const now = new Date();
    const start = now.toISOString().split('T')[0];
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    form.reset({ name: '', category_id: '', amount: '', period: 'monthly', start_date: start, end_date: end });
    setModalOpen(true);
  };

  const openEdit = (item: Budget) => {
    setEditing(item);
    form.reset({
      name: item.name,
      category_id: item.category_id ? String(item.category_id) : '',
      amount: String(item.amount),
      period: item.period,
      start_date: item.start_date.split('T')[0],
      end_date: item.end_date.split('T')[0],
    });
    setModalOpen(true);
  };

  const submitForm = async (d: BudgetFormData) => {
    if (!currentEntity) return;
    setSaving(true);
    try {
      const payload = {
        entity_id: currentEntity.id,
        category_id: d.category_id ? Number(d.category_id) : undefined,
        name: d.name,
        amount: parseFloat(d.amount),
        period: d.period,
        start_date: d.start_date,
        end_date: d.end_date,
      };
      if (editing) {
        await budgetApi.update(editing.id, payload);
      } else {
        await budgetApi.create(payload);
      }
      setModalOpen(false);
      fetchData();
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await budgetApi.delete(deleteId);
      setDeleteId(null);
      fetchData();
    } catch {
      // silent
    } finally {
      setDeleting(false);
    }
  };

  const getProgressInfo = (spent: number, amount: number) => {
    const pct = amount > 0 ? (spent / amount) * 100 : 0;
    const color = pct > 100 ? 'bg-danger' : pct >= 80 ? 'bg-warning' : 'bg-success';
    return { pct: Math.min(pct, 100), color, label: pct > 100 ? 'Dépassé' : pct >= 80 ? 'Presque atteint' : 'Dans les limites' };
  };

  const totalBudgeted = budgets.reduce((s, b) => s + b.amount, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);

  if (loading) return <LoadingSpinner size="lg" text="Chargement des budgets..." />;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h3 fw-bold mb-0">Budgets</h1>
          <p className="text-secondary small mb-0">{budgets.length} budget(s)</p>
        </div>
        <Button onClick={openCreate}>Nouveau budget</Button>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      {/* Summary */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-primary text-white">
            <div className="card-body text-center py-3">
              <div className="text-white text-opacity-75 small text-uppercase fw-semibold">Budget total</div>
              <div className="fs-3 fw-bold">&euro;{totalBudgeted.toFixed(2)}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-warning text-white">
            <div className="card-body text-center py-3">
              <div className="text-white text-opacity-75 small text-uppercase fw-semibold">D&eacute;pens&eacute;</div>
              <div className="fs-3 fw-bold">&euro;{totalSpent.toFixed(2)}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className={`card border-0 shadow-sm text-white ${totalBudgeted - totalSpent >= 0 ? 'bg-success' : 'bg-danger'}`}>
            <div className="card-body text-center py-3">
              <div className="text-white text-opacity-75 small text-uppercase fw-semibold">Restant</div>
              <div className="fs-3 fw-bold">&euro;{(totalBudgeted - totalSpent).toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {budgets.length === 0 && !error ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <p className="text-secondary mb-3">Aucun budget d&eacute;fini.</p>
            <Button onClick={openCreate}>Cr&eacute;er un budget</Button>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {budgets.map((budget) => {
            const { pct, color, label } = getProgressInfo(budget.spent, budget.amount);
            return (
              <div key={budget.id} className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="fw-bold mb-0">{budget.name}</h6>
                        <span className="badge bg-secondary bg-opacity-10 text-secondary" style={{ fontSize: '0.7rem' }}>{periodLabels[budget.period] || budget.period}</span>
                      </div>
                      <span className={`badge ${pct >= 100 ? 'bg-danger' : pct >= 80 ? 'bg-warning' : 'bg-success'}`}>{label}</span>
                    </div>
                    {budget.category_id && <p className="small text-secondary mb-2">Cat&eacute;gorie: {categories.find((c) => c.id === budget.category_id)?.name || '-'}</p>}
                    <div className="mb-2">
                      <div className="d-flex justify-content-between small mb-1">
                        <span>&euro;{budget.spent.toFixed(2)} d&eacute;pens&eacute;s</span>
                        <span className="fw-semibold">{budget.amount > 0 ? Math.round((budget.spent / budget.amount) * 100) : 0}%</span>
                      </div>
                      <div className="progress" style={{ height: 8 }}>
                        <div className={`progress-bar ${color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div className="d-flex justify-content-between small text-secondary">
                      <span>Objectif: &euro;{budget.amount.toFixed(2)}</span>
                      <span>Restant: &euro;{Math.max(0, budget.amount - budget.spent).toFixed(2)}</span>
                    </div>
                    <div className="d-flex gap-2 mt-3 pt-3 border-top">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(budget)}>Modifier</Button>
                      <Button variant="ghost" size="sm" className="text-danger" onClick={() => setDeleteId(budget.id)}>Supprimer</Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier le budget' : 'Nouveau budget'}>
        <form onSubmit={form.handleSubmit(submitForm)}>
          <Input label="Nom" register={form.register('name')} error={form.formState.errors.name?.message} placeholder="Ex: Budget courses" />
          <Select label="Catégorie (optionnelle)" options={categories.map((c) => ({ value: c.id, label: c.name }))} register={form.register('category_id')} placeholder="Aucune" />
          <Input label="Montant" type="number" step="0.01" register={form.register('amount')} error={form.formState.errors.amount?.message} />
          <Select label="Période" options={Object.entries(periodLabels).map(([v, l]) => ({ value: v, label: l }))} register={form.register('period')} error={form.formState.errors.period?.message} />
          <Input label="Date de début" type="date" register={form.register('start_date')} error={form.formState.errors.start_date?.message} />
          <Input label="Date de fin" type="date" register={form.register('end_date')} error={form.formState.errors.end_date?.message} />
          <div className="d-flex gap-2 mt-3">
            <Button type="submit" loading={saving}>{editing ? 'Enregistrer' : 'Créer'}</Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Confirmer la suppression">
        <p>Êtes-vous sûr de vouloir supprimer ce budget ?</p>
        <div className="d-flex gap-2">
          <Button variant="danger" onClick={confirmDelete} loading={deleting}>Supprimer</Button>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Annuler</Button>
        </div>
      </Modal>
    </div>
  );
}
