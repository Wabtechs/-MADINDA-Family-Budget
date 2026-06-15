import { useEffect, useState } from 'react';
import useEntityStore from '../../store/entityStore';
import { debtApi } from '../../services/api';
import type { Debt, DebtPayment } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const debtSchema = z.object({
  type: z.enum(['lent', 'borrowed']),
  contact_name: z.string().min(1, 'Le nom du contact est requis'),
  amount: z.string().min(1, 'Le montant est requis'),
  description: z.string().optional(),
  due_date: z.string().optional(),
});

type DebtFormData = z.infer<typeof debtSchema>;

const paymentSchema = z.object({
  amount: z.string().min(1, 'Le montant est requis'),
  payment_date: z.string().min(1, 'La date est requise'),
  note: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

const typeLabels: Record<string, string> = {
  lent: 'On nous doit',
  borrowed: 'Nous devons',
};

const statusLabels: Record<string, string> = {
  active: 'Active',
  paid: 'Payé',
  overdue: 'En retard',
};

const statusColors: Record<string, string> = {
  active: 'bg-primary',
  paid: 'bg-success',
  overdue: 'bg-danger',
};

export default function DebtsPage() {
  const { currentEntity } = useEntityStore();
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Debt | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [tab, setTab] = useState<'lent' | 'borrowed'>('lent');
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  const [payments, setPayments] = useState<DebtPayment[]>([]);
  const [paymentModal, setPaymentModal] = useState(false);
  const [paySaving, setPaySaving] = useState(false);

  const form = useForm<DebtFormData>({
    resolver: zodResolver(debtSchema),
    defaultValues: { type: 'lent', contact_name: '', amount: '', description: '', due_date: '' },
  });

  const payForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { amount: '', payment_date: new Date().toISOString().split('T')[0], note: '' },
  });

  const fetchDebts = async () => {
    if (!currentEntity) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await debtApi.list(currentEntity.id);
      setDebts(Array.isArray(data) ? data : data.data || data.debts || []);
    } catch {
      setError('Erreur lors du chargement.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDebts(); }, [currentEntity]);

  const openCreate = () => {
    setEditing(null);
    form.reset({ type: tab, contact_name: '', amount: '', description: '', due_date: '' });
    setModalOpen(true);
  };

  const openEdit = (item: Debt) => {
    setEditing(item);
    form.reset({ type: item.type, contact_name: item.contact_name, amount: String(item.amount), description: item.description || '', due_date: item.due_date ? item.due_date.split('T')[0] : '' });
    setModalOpen(true);
  };

  const submitForm = async (d: DebtFormData) => {
    if (!currentEntity) return;
    setSaving(true);
    try {
      const payload = { entity_id: currentEntity.id, type: d.type, contact_name: d.contact_name, amount: parseFloat(d.amount), description: d.description || undefined, due_date: d.due_date || undefined };
      if (editing) {
        await debtApi.update(editing.id, payload);
      } else {
        await debtApi.create(payload);
      }
      setModalOpen(false);
      fetchDebts();
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
      await debtApi.delete(deleteId);
      setDeleteId(null);
      if (selectedDebt?.id === deleteId) setSelectedDebt(null);
      fetchDebts();
    } catch {
      // silent
    } finally {
      setDeleting(false);
    }
  };

  const viewDebt = async (debt: Debt) => {
    setSelectedDebt(debt);
    try {
      const { data } = await debtApi.getPayments(debt.id);
      setPayments(Array.isArray(data) ? data : data.data || data.payments || []);
    } catch {
      setPayments([]);
    }
  };

  const handlePayment = async (d: PaymentFormData) => {
    if (!selectedDebt) return;
    setPaySaving(true);
    try {
      await debtApi.addPayment(selectedDebt.id, { amount: parseFloat(d.amount), payment_date: d.payment_date, note: d.note || undefined });
      setPaymentModal(false);
      payForm.reset({ amount: '', payment_date: new Date().toISOString().split('T')[0], note: '' });
      viewDebt(selectedDebt);
      fetchDebts();
    } catch {
      // silent
    } finally {
      setPaySaving(false);
    }
  };

  const filteredDebts = debts.filter((d) => d.type === tab);

  if (loading) return <LoadingSpinner size="lg" text="Chargement des dettes..." />;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h3 fw-bold mb-0">Dettes</h1>
          <p className="text-secondary small mb-0">{debts.length} dette(s)</p>
        </div>
        <Button onClick={openCreate}>Nouvelle dette</Button>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${tab === 'lent' ? 'active fw-semibold' : ''}`} onClick={() => setTab('lent')}>On nous doit ({debts.filter((d) => d.type === 'lent').length})</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'borrowed' ? 'active fw-semibold' : ''}`} onClick={() => setTab('borrowed')}>Nous devons ({debts.filter((d) => d.type === 'borrowed').length})</button>
        </li>
      </ul>

      <div className="row g-4">
        {/* Debt List */}
        <div className={`${selectedDebt ? 'col-lg-6' : 'col-12'}`}>
          {filteredDebts.length === 0 && !error ? (
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-5">
                <p className="text-secondary mb-3">Aucune dette dans cette cat&eacute;gorie.</p>
                <Button onClick={openCreate}>Ajouter une dette</Button>
              </div>
            </div>
          ) : (
            <div className="row g-3">
              {filteredDebts.map((debt) => {
                const remaining = debt.remaining_amount ?? debt.amount;
                const pct = debt.amount > 0 ? ((debt.amount - remaining) / debt.amount) * 100 : 0;
                return (
                  <div key={debt.id} className="col-12">
                    <div className={`card border-0 shadow-sm ${selectedDebt?.id === debt.id ? 'border border-primary' : ''}`} style={{ cursor: 'pointer' }} onClick={() => viewDebt(debt)}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1 min-w-0">
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <h6 className="fw-bold mb-0">{debt.contact_name}</h6>
                              <span className={`badge ${statusColors[debt.status]} text-white`}>{statusLabels[debt.status]}</span>
                            </div>
                            {debt.description && <p className="small text-secondary mb-1">{debt.description}</p>}
                            {debt.due_date && <p className="small text-secondary mb-1">&Eacute;ch&eacute;ance: {new Date(debt.due_date).toLocaleDateString('fr-FR')}</p>}
                          </div>
                          <div className="text-end flex-shrink-0">
                            <div className="fw-bold fs-5">&euro;{remaining.toFixed(2)}</div>
                            <div className="small text-secondary">sur &euro;{debt.amount.toFixed(2)}</div>
                          </div>
                        </div>
                        <div className="progress mt-2" style={{ height: 5 }}>
                          <div className="progress-bar bg-primary" style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <div className="d-flex gap-2 mt-2">
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEdit(debt); }}>Modifier</Button>
                          <Button variant="ghost" size="sm" className="text-danger" onClick={(e) => { e.stopPropagation(); setDeleteId(debt.id); }}>Supprimer</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Debt Detail */}
        {selectedDebt && (
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="fw-bold mb-1">{selectedDebt.contact_name}</h5>
                    <span className={`badge ${statusColors[selectedDebt.status]} text-white`}>{statusLabels[selectedDebt.status]}</span>
                    <span className="badge bg-secondary bg-opacity-10 text-secondary ms-2">{typeLabels[selectedDebt.type]}</span>
                  </div>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedDebt(null)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="small text-secondary">Montant total</div>
                    <div className="fw-bold">&euro;{selectedDebt.amount.toFixed(2)}</div>
                  </div>
                  <div className="col-6">
                    <div className="small text-secondary">Restant</div>
                    <div className="fw-bold text-danger">&euro;{(selectedDebt.remaining_amount ?? selectedDebt.amount).toFixed(2)}</div>
                  </div>
                </div>
                {selectedDebt.description && <p className="small text-secondary mb-2">{selectedDebt.description}</p>}
                {selectedDebt.due_date && <p className="small text-secondary mb-2">&Eacute;ch&eacute;ance: {new Date(selectedDebt.due_date).toLocaleDateString('fr-FR')}</p>}

                <hr />
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-bold mb-0">Historique des paiements</h6>
                  <Button size="sm" onClick={() => { payForm.reset({ amount: '', payment_date: new Date().toISOString().split('T')[0], note: '' }); setPaymentModal(true); }}>+ Ajouter un paiement</Button>
                </div>
                {payments.length === 0 ? (
                  <p className="small text-secondary">Aucun paiement enregistr&eacute;.</p>
                ) : (
                  <div className="list-group list-group-flush">
                    {payments.map((p) => (
                      <div key={p.id} className="list-group-item px-0 border-0 border-bottom d-flex justify-content-between align-items-center">
                        <div>
                          <div className="small fw-semibold">&euro;{p.amount.toFixed(2)}</div>
                          {p.note && <div className="small text-secondary">{p.note}</div>}
                        </div>
                        <div className="small text-secondary">{new Date(p.payment_date).toLocaleDateString('fr-FR')}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier la dette' : 'Nouvelle dette'}>
        <form onSubmit={form.handleSubmit(submitForm)}>
          {!editing && (
            <Select label="Type" options={[{ value: 'lent', label: 'On nous doit' }, { value: 'borrowed', label: 'Nous devons' }]} register={form.register('type')} error={form.formState.errors.type?.message} />
          )}
          <Input label="Nom du contact" register={form.register('contact_name')} error={form.formState.errors.contact_name?.message} placeholder="Ex: Jean Dupont" />
          <Input label="Montant" type="number" step="0.01" register={form.register('amount')} error={form.formState.errors.amount?.message} />
          <Input label="Date d'échéance" type="date" register={form.register('due_date')} error={form.formState.errors.due_date?.message} />
          <Input label="Description" register={form.register('description')} error={form.formState.errors.description?.message} />
          <div className="d-flex gap-2 mt-3">
            <Button type="submit" loading={saving}>{editing ? 'Enregistrer' : 'Créer'}</Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>

      {/* Payment Modal */}
      <Modal isOpen={paymentModal} onClose={() => setPaymentModal(false)} title="Ajouter un paiement">
        <form onSubmit={payForm.handleSubmit(handlePayment)}>
          <Input label="Montant" type="number" step="0.01" register={payForm.register('amount')} error={payForm.formState.errors.amount?.message} />
          <Input label="Date de paiement" type="date" register={payForm.register('payment_date')} error={payForm.formState.errors.payment_date?.message} />
          <Input label="Note" register={payForm.register('note')} error={payForm.formState.errors.note?.message} />
          <div className="d-flex gap-2 mt-3">
            <Button type="submit" loading={paySaving}>Ajouter</Button>
            <Button variant="secondary" onClick={() => setPaymentModal(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Confirmer la suppression">
        <p>Êtes-vous sûr de vouloir supprimer cette dette ?</p>
        <div className="d-flex gap-2">
          <Button variant="danger" onClick={confirmDelete} loading={deleting}>Supprimer</Button>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Annuler</Button>
        </div>
      </Modal>
    </div>
  );
}
