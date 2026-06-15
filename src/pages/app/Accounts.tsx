import { useEffect, useState } from 'react';
import useEntityStore from '../../store/entityStore';
import { accountApi } from '../../services/api';
import type { Account } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const accountSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  type: z.enum(['checking', 'savings', 'cash', 'credit_card', 'investment', 'other']),
  balance: z.string().min(1, 'Le solde est requis'),
  currency: z.string().min(1, 'La devise est requise'),
  account_number: z.string().optional(),
  bank_name: z.string().optional(),
  description: z.string().optional(),
});

type AccountFormData = z.infer<typeof accountSchema>;

const accountTypeLabels: Record<string, string> = {
  checking: 'Courant',
  savings: 'Épargne',
  cash: 'Espèces',
  credit_card: 'Carte de crédit',
  investment: 'Investissement',
  other: 'Autre',
};

const accountTypeIcons: Record<string, string> = {
  checking: 'M3 3h18v18H3V3zm2 2v14h14V5H5z',
  savings: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
  cash: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  credit_card: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  investment: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  other: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4',
};

export default function AccountsPage() {
  const { currentEntity } = useEntityStore();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: { name: '', type: 'checking', balance: '', currency: 'EUR', account_number: '', bank_name: '', description: '' },
  });

  const fetchAccounts = async () => {
    if (!currentEntity) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await accountApi.list(currentEntity.id);
      setAccounts(Array.isArray(data) ? data : data.data || data.accounts || []);
    } catch {
      setError('Erreur lors du chargement des comptes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAccounts(); }, [currentEntity]);

  const openCreate = () => {
    setEditingAccount(null);
    form.reset({ name: '', type: 'checking', balance: '', currency: 'EUR', account_number: '', bank_name: '', description: '' });
    setModalOpen(true);
  };

  const openEdit = (account: Account) => {
    setEditingAccount(account);
    form.reset({
      name: account.name,
      type: account.type,
      balance: String(account.balance),
      currency: account.currency,
      account_number: account.account_number || '',
      bank_name: account.bank_name || '',
      description: account.description || '',
    });
    setModalOpen(true);
  };

  const submitForm = async (formData: AccountFormData) => {
    if (!currentEntity) return;
    setSaving(true);
    try {
      const payload = { ...formData, balance: parseFloat(formData.balance), entity_id: currentEntity.id };
      if (editingAccount) {
        await accountApi.update(editingAccount.id, payload);
      } else {
        await accountApi.create(payload);
      }
      setModalOpen(false);
      fetchAccounts();
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
      await accountApi.delete(deleteId);
      setDeleteId(null);
      fetchAccounts();
    } catch {
      // silent
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" text="Chargement des comptes..." />;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h3 fw-bold mb-0">Comptes</h1>
          <p className="text-secondary small mb-0">{accounts.length} compte(s)</p>
        </div>
        <Button onClick={openCreate}>Nouveau compte</Button>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      {accounts.length === 0 && !error ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <p className="text-secondary mb-3">Aucun compte pour le moment.</p>
            <Button onClick={openCreate}>Cr&eacute;er un compte</Button>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {accounts.map((account) => (
            <div key={account.id} className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="rounded-circle bg-primary/10 d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={accountTypeIcons[account.type] || accountTypeIcons.other} />
                      </svg>
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <h6 className="fw-bold mb-0 text-truncate">{account.name}</h6>
                      <span className="badge bg-secondary/10 text-secondary" style={{ fontSize: '0.7rem' }}>{accountTypeLabels[account.type] || account.type}</span>
                    </div>
                  </div>
                  {account.bank_name && <p className="small text-secondary mb-2"><span className="fw-semibold">Banque:</span> {account.bank_name}</p>}
                  {account.account_number && <p className="small text-secondary mb-2"><span className="fw-semibold">N°:</span> {account.account_number}</p>}
                  <p className={`fw-bold fs-5 mb-0 ${account.balance >= 0 ? 'text-success' : 'text-danger'}`}>
                    &euro;{account.balance.toFixed(2)}
                  </p>
                  <div className="d-flex gap-2 mt-3 pt-3 border-top">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(account)}>Modifier</Button>
                    <Button variant="ghost" size="sm" className="text-danger" onClick={() => setDeleteId(account.id)}>Supprimer</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingAccount ? 'Modifier le compte' : 'Nouveau compte'}>
        <form onSubmit={form.handleSubmit(submitForm)}>
          <Input label="Nom" register={form.register('name')} error={form.formState.errors.name?.message} placeholder="Ex: Compte principal" />
          <Select label="Type" options={Object.entries(accountTypeLabels).map(([v, l]) => ({ value: v, label: l }))} register={form.register('type')} error={form.formState.errors.type?.message} />
          <Input label="Solde initial" type="number" step="0.01" register={form.register('balance')} error={form.formState.errors.balance?.message} />
          <Input label="Devise" register={form.register('currency')} error={form.formState.errors.currency?.message} placeholder="EUR" />
          <Input label="Numéro de compte" register={form.register('account_number')} error={form.formState.errors.account_number?.message} />
          <Input label="Nom de la banque" register={form.register('bank_name')} error={form.formState.errors.bank_name?.message} />
          <Input label="Description" register={form.register('description')} error={form.formState.errors.description?.message} />
          <div className="d-flex gap-2 mt-3">
            <Button type="submit" loading={saving}>{editingAccount ? 'Enregistrer' : 'Cr&eacute;er'}</Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Confirmer la suppression">
        <p>&Ecirc;tes-vous s&ucirc;r de vouloir supprimer ce compte ? Cette action est irr&eacute;versible.</p>
        <div className="d-flex gap-2">
          <Button variant="danger" onClick={confirmDelete} loading={deleting}>Supprimer</Button>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Annuler</Button>
        </div>
      </Modal>
    </div>
  );
}
