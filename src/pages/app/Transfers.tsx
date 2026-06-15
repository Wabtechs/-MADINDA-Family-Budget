import { useEffect, useState } from 'react';
import useEntityStore from '../../store/entityStore';
import { transferApi, accountApi } from '../../services/api';
import type { Transfer, Account } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const transferSchema = z.object({
  from_account_id: z.string().min(1, 'Le compte source est requis'),
  to_account_id: z.string().min(1, 'Le compte destination est requis'),
  amount: z.string().min(1, 'Le montant est requis'),
  date: z.string().min(1, 'La date est requise'),
  description: z.string().optional(),
}).refine((data) => data.from_account_id !== data.to_account_id, {
  message: 'Les comptes source et destination doivent être différents',
  path: ['to_account_id'],
});

type TransferFormData = z.infer<typeof transferSchema>;

export default function TransfersPage() {
  const { currentEntity } = useEntityStore();
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: { from_account_id: '', to_account_id: '', amount: '', date: new Date().toISOString().split('T')[0], description: '' },
  });

  const fetchData = async () => {
    if (!currentEntity) return;
    setLoading(true);
    setError('');
    try {
      const [trRes, accRes] = await Promise.all([
        transferApi.list({ entity_id: currentEntity.id }),
        accountApi.list(currentEntity.id),
      ]);
      setTransfers(Array.isArray(trRes.data) ? trRes.data : trRes.data.data || trRes.data.transfers || []);
      setAccounts(Array.isArray(accRes.data) ? accRes.data : accRes.data.data || accRes.data.accounts || []);
    } catch {
      setError('Erreur lors du chargement.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [currentEntity]);

  const openCreate = () => {
    form.reset({ from_account_id: '', to_account_id: '', amount: '', date: new Date().toISOString().split('T')[0], description: '' });
    setModalOpen(true);
  };

  const submitForm = async (d: TransferFormData) => {
    if (!currentEntity) return;
    setSaving(true);
    try {
      await transferApi.create({
        entity_id: currentEntity.id,
        from_account_id: Number(d.from_account_id),
        to_account_id: Number(d.to_account_id),
        amount: parseFloat(d.amount),
        description: d.description || '',
        date: d.date,
      });
      setModalOpen(false);
      fetchData();
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" text="Chargement des transferts..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-0">Transferts</h1>
          <p className="text-gray-500 text-sm mb-0">{transfers.length} transfert(s)</p>
        </div>
        <Button onClick={openCreate}>Nouveau transfert</Button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>}

      {transfers.length === 0 && !error ? (
        <div className="bg-white rounded-xl border-0 shadow-sm">
          <div className="p-6 text-center py-12">
            <p className="text-gray-500 mb-4">Aucun transfert pour le moment.</p>
            <Button onClick={openCreate}>Effectuer un transfert</Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {transfers.map((tr) => (
            <div key={tr.id} className="md:w-1/2">
              <div className="bg-white rounded-xl border-0 shadow-sm">
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-100 flex items-center justify-center" style={{ width: 40, height: 40 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-semibold truncate">{tr.from_account_name || 'Compte source'}</div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                        </svg>
                        <div className="text-sm font-semibold truncate">{tr.to_account_name || 'Compte destination'}</div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-lg text-blue-500">&euro;{tr.amount.toFixed(2)}</span>
                        <span className="text-gray-500" style={{ fontSize: '0.75rem' }}>{new Date(tr.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                      {tr.description && <p className="text-sm text-gray-500 mt-1 mb-0">{tr.description}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Nouveau transfert">
        <form onSubmit={form.handleSubmit(submitForm)}>
          <Select label="Compte source" options={accounts.map((a) => ({ value: a.id, label: `${a.name} (€${a.balance.toFixed(2)})` }))} register={form.register('from_account_id')} error={form.formState.errors.from_account_id?.message} placeholder="Sélectionner" />
          <Select label="Compte destination" options={accounts.map((a) => ({ value: a.id, label: a.name }))} register={form.register('to_account_id')} error={form.formState.errors.to_account_id?.message} placeholder="Sélectionner" />
          <Input label="Montant" type="number" step="0.01" register={form.register('amount')} error={form.formState.errors.amount?.message} />
          <Input label="Date" type="date" register={form.register('date')} error={form.formState.errors.date?.message} />
          <Input label="Description" register={form.register('description')} error={form.formState.errors.description?.message} />
          <div className="flex gap-2 mt-4">
            <Button type="submit" loading={saving}>Effectuer le transfert</Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
