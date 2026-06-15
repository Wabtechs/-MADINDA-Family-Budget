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
    const color = pct > 100 ? 'bg-red-500' : pct >= 80 ? 'bg-yellow-500' : 'bg-emerald-500';
    return { pct: Math.min(pct, 100), color, label: pct > 100 ? 'Dépassé' : pct >= 80 ? 'Presque atteint' : 'Dans les limites' };
  };

  const totalBudgeted = budgets.reduce((s, b) => s + b.amount, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);

  if (loading) return <LoadingSpinner size="lg" text="Chargement des budgets..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-0">Budgets</h1>
          <p className="text-gray-500 text-sm mb-0">{budgets.length} budget(s)</p>
        </div>
        <Button onClick={openCreate}>Nouveau budget</Button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>}

      {/* Summary */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="md:w-1/3">
          <div className="bg-indigo-500 text-white rounded-xl border-0 shadow-sm">
            <div className="p-6 text-center">
              <div className="text-white/75 text-sm uppercase font-semibold">Budget total</div>
              <div className="text-2xl font-bold">&euro;{totalBudgeted.toFixed(2)}</div>
            </div>
          </div>
        </div>
        <div className="md:w-1/3">
          <div className="bg-yellow-500 text-white rounded-xl border-0 shadow-sm">
            <div className="p-6 text-center">
              <div className="text-white/75 text-sm uppercase font-semibold">Dépensé</div>
              <div className="text-2xl font-bold">&euro;{totalSpent.toFixed(2)}</div>
            </div>
          </div>
        </div>
        <div className="md:w-1/3">
          <div className={`text-white rounded-xl border-0 shadow-sm ${totalBudgeted - totalSpent >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}>
            <div className="p-6 text-center">
              <div className="text-white/75 text-sm uppercase font-semibold">Restant</div>
              <div className="text-2xl font-bold">&euro;{(totalBudgeted - totalSpent).toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {budgets.length === 0 && !error ? (
        <div className="bg-white rounded-xl border-0 shadow-sm">
          <div className="p-6 text-center py-12">
            <p className="text-gray-500 mb-4">Aucun budget défini.</p>
            <Button onClick={openCreate}>Créer un budget</Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {budgets.map((budget) => {
            const { pct, color, label } = getProgressInfo(budget.spent, budget.amount);
            return (
              <div key={budget.id} className="md:w-1/2 lg:w-1/3">
                <div className="bg-white rounded-xl border-0 shadow-sm h-full">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h6 className="font-bold mb-0">{budget.name}</h6>
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700" style={{ fontSize: '0.7rem' }}>{periodLabels[budget.period] || budget.period}</span>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${pct >= 100 ? 'bg-red-500 text-white' : pct >= 80 ? 'bg-yellow-500 text-white' : 'bg-emerald-500 text-white'}`}>{label}</span>
                    </div>
                    {budget.category_id && <p className="text-sm text-gray-500 mb-2">Catégorie: {categories.find((c) => c.id === budget.category_id)?.name || '-'}</p>}
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>&euro;{budget.spent.toFixed(2)} dépensés</span>
                        <span className="font-semibold">{budget.amount > 0 ? Math.round((budget.spent / budget.amount) * 100) : 0}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden" style={{ height: 8 }}>
                        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Objectif: &euro;{budget.amount.toFixed(2)}</span>
                      <span>Restant: &euro;{Math.max(0, budget.amount - budget.spent).toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2 mt-4 pt-3 border-t">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(budget)}>Modifier</Button>
                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setDeleteId(budget.id)}>Supprimer</Button>
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
          <div className="flex gap-2 mt-4">
            <Button type="submit" loading={saving}>{editing ? 'Enregistrer' : 'Créer'}</Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Confirmer la suppression">
        <p>Êtes-vous sûr de vouloir supprimer ce budget ?</p>
        <div className="flex gap-2">
          <Button variant="danger" onClick={confirmDelete} loading={deleting}>Supprimer</Button>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Annuler</Button>
        </div>
      </Modal>
    </div>
  );
}
