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
  active: 'bg-indigo-500',
  paid: 'bg-emerald-500',
  overdue: 'bg-red-500',
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-0">Dettes</h1>
          <p className="text-gray-500 text-sm mb-0">{debts.length} dette(s)</p>
        </div>
        <Button onClick={openCreate}>Nouvelle dette</Button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>}

      {/* Tabs */}
      <ul className="flex border-b border-gray-200 mb-6">
        <li className="mr-1">
          <button className={`inline-block px-4 py-2 text-sm font-medium border-b-2 ${tab === 'lent' ? 'border-indigo-500 text-indigo-600 font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700'}`} onClick={() => setTab('lent')}>On nous doit ({debts.filter((d) => d.type === 'lent').length})</button>
        </li>
        <li className="mr-1">
          <button className={`inline-block px-4 py-2 text-sm font-medium border-b-2 ${tab === 'borrowed' ? 'border-indigo-500 text-indigo-600 font-semibold' : 'border-transparent text-gray-500 hover:text-gray-700'}`} onClick={() => setTab('borrowed')}>Nous devons ({debts.filter((d) => d.type === 'borrowed').length})</button>
        </li>
      </ul>

      <div className="flex flex-wrap gap-6">
        {/* Debt List */}
        <div className={`${selectedDebt ? 'lg:w-1/2' : 'w-full'}`}>
          {filteredDebts.length === 0 && !error ? (
            <div className="bg-white rounded-xl border-0 shadow-sm">
              <div className="p-6 text-center py-12">
                <p className="text-gray-500 mb-4">Aucune dette dans cette catégorie.</p>
                <Button onClick={openCreate}>Ajouter une dette</Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {filteredDebts.map((debt) => {
                const remaining = debt.remaining_amount ?? debt.amount;
                const pct = debt.amount > 0 ? ((debt.amount - remaining) / debt.amount) * 100 : 0;
                return (
                  <div key={debt.id} className="w-full">
                    <div className={`bg-white rounded-xl border-0 shadow-sm ${selectedDebt?.id === debt.id ? 'border border-indigo-500' : ''}`} style={{ cursor: 'pointer' }} onClick={() => viewDebt(debt)}>
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h6 className="font-bold mb-0">{debt.contact_name}</h6>
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[debt.status]} text-white`}>{statusLabels[debt.status]}</span>
                            </div>
                            {debt.description && <p className="text-sm text-gray-500 mb-1">{debt.description}</p>}
                            {debt.due_date && <p className="text-sm text-gray-500 mb-1">Échéance: {new Date(debt.due_date).toLocaleDateString('fr-FR')}</p>}
                          </div>
                          <div className="text-end shrink-0">
                            <div className="font-bold text-lg">&euro;{remaining.toFixed(2)}</div>
                            <div className="text-sm text-gray-500">sur &euro;{debt.amount.toFixed(2)}</div>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-2" style={{ height: 5 }}>
                          <div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEdit(debt); }}>Modifier</Button>
                          <Button variant="ghost" size="sm" className="text-red-500" onClick={(e) => { e.stopPropagation(); setDeleteId(debt.id); }}>Supprimer</Button>
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
          <div className="lg:w-1/2">
            <div className="bg-white rounded-xl border-0 shadow-sm">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h5 className="font-bold mb-1">{selectedDebt.contact_name}</h5>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[selectedDebt.status]} text-white`}>{statusLabels[selectedDebt.status]}</span>
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 ml-2">{typeLabels[selectedDebt.type]}</span>
                  </div>
                  <button className="border border-gray-400 text-gray-600 hover:bg-gray-100 inline-flex items-center justify-center font-medium rounded-lg transition-colors px-3 py-1.5 text-sm" onClick={() => setSelectedDebt(null)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="w-1/2">
                    <div className="text-sm text-gray-500">Montant total</div>
                    <div className="font-bold">&euro;{selectedDebt.amount.toFixed(2)}</div>
                  </div>
                  <div className="w-1/2">
                    <div className="text-sm text-gray-500">Restant</div>
                    <div className="font-bold text-red-500">&euro;{(selectedDebt.remaining_amount ?? selectedDebt.amount).toFixed(2)}</div>
                  </div>
                </div>
                {selectedDebt.description && <p className="text-sm text-gray-500 mb-2">{selectedDebt.description}</p>}
                {selectedDebt.due_date && <p className="text-sm text-gray-500 mb-2">Échéance: {new Date(selectedDebt.due_date).toLocaleDateString('fr-FR')}</p>}

                <hr />
                <div className="flex justify-between items-center mb-2">
                  <h6 className="font-bold mb-0">Historique des paiements</h6>
                  <Button size="sm" onClick={() => { payForm.reset({ amount: '', payment_date: new Date().toISOString().split('T')[0], note: '' }); setPaymentModal(true); }}>+ Ajouter un paiement</Button>
                </div>
                {payments.length === 0 ? (
                  <p className="text-sm text-gray-500">Aucun paiement enregistré.</p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {payments.map((p) => (
                      <div key={p.id} className="px-0 py-3 flex justify-between items-center">
                        <div>
                          <div className="text-sm font-semibold">&euro;{p.amount.toFixed(2)}</div>
                          {p.note && <div className="text-sm text-gray-500">{p.note}</div>}
                        </div>
                        <div className="text-sm text-gray-500">{new Date(p.payment_date).toLocaleDateString('fr-FR')}</div>
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
          <div className="flex gap-2 mt-4">
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
          <div className="flex gap-2 mt-4">
            <Button type="submit" loading={paySaving}>Ajouter</Button>
            <Button variant="secondary" onClick={() => setPaymentModal(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Confirmer la suppression">
        <p>Êtes-vous sûr de vouloir supprimer cette dette ?</p>
        <div className="flex gap-2">
          <Button variant="danger" onClick={confirmDelete} loading={deleting}>Supprimer</Button>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Annuler</Button>
        </div>
      </Modal>
    </div>
  );
}
