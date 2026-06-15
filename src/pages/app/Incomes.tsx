import { useEffect, useState } from 'react';
import useEntityStore from '../../store/entityStore';
import { incomeApi, categoryApi, accountApi } from '../../services/api';
import type { Income, Category, Account } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const incomeSchema = z.object({
  amount: z.string().min(1, 'Le montant est requis'),
  category_id: z.string().min(1, 'La catégorie est requise'),
  account_id: z.string().min(1, 'Le compte est requis'),
  date: z.string().min(1, 'La date est requise'),
  description: z.string().optional(),
});

type IncomeFormData = z.infer<typeof incomeSchema>;

export default function IncomesPage() {
  const { currentEntity } = useEntityStore();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Income | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [filterCat, setFilterCat] = useState('');
  const [filterAcc, setFilterAcc] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const form = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: { amount: '', category_id: '', account_id: '', date: new Date().toISOString().split('T')[0], description: '' },
  });

  const fetchData = async () => {
    if (!currentEntity) return;
    setLoading(true);
    setError('');
    try {
      const [incRes, catRes, accRes] = await Promise.all([
        incomeApi.list({ entity_id: currentEntity.id }),
        categoryApi.list({ type: 'income', entity_id: currentEntity.id }),
        accountApi.list(currentEntity.id),
      ]);
      setIncomes(Array.isArray(incRes.data) ? incRes.data : incRes.data.data || incRes.data.incomes || []);
      setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.data || catRes.data.categories || []);
      setAccounts(Array.isArray(accRes.data) ? accRes.data : accRes.data.data || accRes.data.accounts || []);
    } catch {
      setError('Erreur lors du chargement.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [currentEntity]);

  const openCreate = () => {
    setEditing(null);
    form.reset({ amount: '', category_id: '', account_id: '', date: new Date().toISOString().split('T')[0], description: '' });
    setModalOpen(true);
  };

  const openEdit = (item: Income) => {
    setEditing(item);
    form.reset({ amount: String(item.amount), category_id: String(item.category_id), account_id: String(item.account_id), date: item.date.split('T')[0], description: item.description || '' });
    setModalOpen(true);
  };

  const submitForm = async (d: IncomeFormData) => {
    if (!currentEntity) return;
    setSaving(true);
    try {
      const payload = { entity_id: currentEntity.id, account_id: Number(d.account_id), category_id: Number(d.category_id), amount: parseFloat(d.amount), description: d.description || '', date: d.date };
      if (editing) {
        await incomeApi.update(editing.id, payload);
      } else {
        await incomeApi.create(payload);
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
      await incomeApi.delete(deleteId);
      setDeleteId(null);
      fetchData();
    } catch {
      // silent
    } finally {
      setDeleting(false);
    }
  };

  const filteredIncomes = incomes.filter((inc) => {
    if (filterCat && inc.category_id !== Number(filterCat)) return false;
    if (filterAcc && inc.account_id !== Number(filterAcc)) return false;
    if (dateFrom && inc.date < dateFrom) return false;
    if (dateTo && inc.date > dateTo) return false;
    return true;
  });

  const totalMonth = filteredIncomes.reduce((sum, inc) => sum + inc.amount, 0);

  const catTotals: Record<string, { total: number; count: number }> = {};
  filteredIncomes.forEach((inc) => {
    const key = inc.category_name || 'Autre';
    if (!catTotals[key]) catTotals[key] = { total: 0, count: 0 };
    catTotals[key].total += inc.amount;
    catTotals[key].count += 1;
  });

  if (loading) return <LoadingSpinner size="lg" text="Chargement des revenus..." />;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h3 fw-bold mb-0">Revenus</h1>
          <p className="text-secondary small mb-0">{incomes.length} revenu(s)</p>
        </div>
        <Button onClick={openCreate}>Nouveau revenu</Button>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      {/* Summary */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-primary text-white">
            <div className="card-body text-center py-3">
              <div className="text-white/75 small text-uppercase fw-semibold">Total (filtr&eacute;)</div>
              <div className="fs-3 fw-bold">&euro;{totalMonth.toFixed(2)}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-3">
              <div className="text-secondary small text-uppercase fw-semibold">Nombre</div>
              <div className="fs-3 fw-bold">{filteredIncomes.length}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-3">
              <div className="text-secondary small text-uppercase fw-semibold">Moyenne</div>
              <div className="fs-3 fw-bold">&euro;{(filteredIncomes.length > 0 ? totalMonth / filteredIncomes.length : 0).toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-2 align-items-end">
            <div className="col-md-3">
              <label className="form-label small fw-semibold">Cat&eacute;gorie</label>
              <select className="form-select form-select-sm" value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
                <option value="">Toutes</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-semibold">Compte</label>
              <select className="form-select form-select-sm" value={filterAcc} onChange={(e) => setFilterAcc(e.target.value)}>
                <option value="">Tous</option>
                {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-semibold">Du</label>
              <input type="date" className="form-control form-control-sm" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-semibold">Au</label>
              <input type="date" className="form-control form-control-sm" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
            <div className="col-md-3">
              <button className="btn btn-sm btn-outline-secondary w-100" onClick={() => { setFilterCat(''); setFilterAcc(''); setDateFrom(''); setDateTo(''); }}>R&eacute;initialiser</button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Stats */}
      {Object.keys(catTotals).length > 0 && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h6 className="fw-bold mb-3">R&eacute;partition par cat&eacute;gorie</h6>
            <div className="table-responsive">
              <table className="table table-sm mb-0">
                <thead><tr><th>Cat&eacute;gorie</th><th>Nombre</th><th className="text-end">Total</th></tr></thead>
                <tbody>
                  {Object.entries(catTotals).sort((a, b) => b[1].total - a[1].total).map(([cat, stats]) => (
                    <tr key={cat}>
                      <td>{cat}</td>
                      <td>{stats.count}</td>
                      <td className="text-end fw-semibold">&euro;{stats.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {filteredIncomes.length === 0 && !error ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <p className="text-secondary mb-3">Aucun revenu trouv&eacute;.</p>
            <Button onClick={openCreate}>Ajouter un revenu</Button>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Cat&eacute;gorie</th>
                  <th>Compte</th>
                  <th className="text-end">Montant</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncomes.map((inc) => (
                  <tr key={inc.id}>
                    <td className="text-nowrap small">{new Date(inc.date).toLocaleDateString('fr-FR')}</td>
                    <td className="small">{inc.description || '-'}</td>
                    <td><span className="badge bg-primary/10 text-primary">{inc.category_name || '-'}</span></td>
                    <td className="small">{inc.account_name || '-'}</td>
                    <td className="text-end fw-bold text-success">&euro;{inc.amount.toFixed(2)}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => openEdit(inc)} title="Modifier">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteId(inc.id)} title="Supprimer">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier le revenu' : 'Nouveau revenu'}>
        <form onSubmit={form.handleSubmit(submitForm)}>
          <Input label="Montant" type="number" step="0.01" register={form.register('amount')} error={form.formState.errors.amount?.message} />
          <Select label="Catégorie" options={categories.map((c) => ({ value: c.id, label: c.name }))} register={form.register('category_id')} error={form.formState.errors.category_id?.message} placeholder="Sélectionner" />
          <Select label="Compte" options={accounts.map((a) => ({ value: a.id, label: a.name }))} register={form.register('account_id')} error={form.formState.errors.account_id?.message} placeholder="Sélectionner" />
          <Input label="Date" type="date" register={form.register('date')} error={form.formState.errors.date?.message} />
          <Input label="Description" register={form.register('description')} error={form.formState.errors.description?.message} />
          <div className="d-flex gap-2 mt-3">
            <Button type="submit" loading={saving}>{editing ? 'Enregistrer' : 'Créer'}</Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Confirmer la suppression">
        <p>Êtes-vous sûr de vouloir supprimer ce revenu ?</p>
        <div className="d-flex gap-2">
          <Button variant="danger" onClick={confirmDelete} loading={deleting}>Supprimer</Button>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Annuler</Button>
        </div>
      </Modal>
    </div>
  );
}
