import { useEffect, useState } from 'react';
import useEntityStore from '../../store/entityStore';
import { goalApi } from '../../services/api';
import type { Goal } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PieChart, Pie, Cell } from 'recharts';

const goalSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  target_amount: z.string().min(1, 'Le montant objectif est requis'),
  current_amount: z.string().min(1, 'Le montant actuel est requis'),
  deadline: z.string().optional(),
  description: z.string().optional(),
});

type GoalFormData = z.infer<typeof goalSchema>;

const statusLabels: Record<string, string> = {
  in_progress: 'En cours',
  completed: 'Terminé',
  cancelled: 'Annulé',
};

const statusColors: Record<string, string> = {
  in_progress: 'bg-primary',
  completed: 'bg-success',
  cancelled: 'bg-secondary',
};

export default function GoalsPage() {
  const { currentEntity } = useEntityStore();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [addModal, setAddModal] = useState<Goal | null>(null);
  const [addingAmount, setAddingAmount] = useState(false);
  const [addValue, setAddValue] = useState('');

  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: { name: '', target_amount: '', current_amount: '0', deadline: '', description: '' },
  });

  const fetchGoals = async () => {
    if (!currentEntity) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await goalApi.list(currentEntity.id);
      setGoals(Array.isArray(data) ? data : data.data || data.goals || []);
    } catch {
      setError('Erreur lors du chargement.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGoals(); }, [currentEntity]);

  const openCreate = () => {
    setEditing(null);
    form.reset({ name: '', target_amount: '', current_amount: '0', deadline: '', description: '' });
    setModalOpen(true);
  };

  const openEdit = (item: Goal) => {
    setEditing(item);
    form.reset({ name: item.name, target_amount: String(item.target_amount), current_amount: String(item.current_amount), deadline: item.deadline ? item.deadline.split('T')[0] : '', description: item.description || '' });
    setModalOpen(true);
  };

  const submitForm = async (d: GoalFormData) => {
    if (!currentEntity) return;
    setSaving(true);
    try {
      const payload = { entity_id: currentEntity.id, name: d.name, target_amount: parseFloat(d.target_amount), current_amount: parseFloat(d.current_amount), deadline: d.deadline || undefined, description: d.description || undefined };
      if (editing) {
        await goalApi.update(editing.id, payload);
      } else {
        await goalApi.create(payload);
      }
      setModalOpen(false);
      fetchGoals();
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
      await goalApi.delete(deleteId);
      setDeleteId(null);
      fetchGoals();
    } catch {
      // silent
    } finally {
      setDeleting(false);
    }
  };

  const handleAddAmount = async () => {
    if (!addModal || !addValue) return;
    setAddingAmount(true);
    try {
      const newAmount = addModal.current_amount + parseFloat(addValue);
      await goalApi.update(addModal.id, { current_amount: newAmount });
      setAddModal(null);
      setAddValue('');
      fetchGoals();
    } catch {
      // silent
    } finally {
      setAddingAmount(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" text="Chargement des objectifs..." />;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h3 fw-bold mb-0">Objectifs financiers</h1>
          <p className="text-secondary small mb-0">{goals.length} objectif(s)</p>
        </div>
        <Button onClick={openCreate}>Nouvel objectif</Button>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      {goals.length === 0 && !error ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <p className="text-secondary mb-3">Aucun objectif d&eacute;fini.</p>
            <Button onClick={openCreate}>Cr&eacute;er un objectif</Button>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {goals.map((goal) => {
            const pct = goal.target_amount > 0 ? Math.round((goal.current_amount / goal.target_amount) * 100) : 0;
            const remaining = Math.max(0, goal.target_amount - goal.current_amount);
            const pieData = [
              { name: 'Atteint', value: goal.current_amount },
              { name: 'Restant', value: remaining },
            ];
            return (
              <div key={goal.id} className="col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between mb-3">
                      <div className="flex-grow-1 min-w-0">
                        <h6 className="fw-bold mb-1 text-truncate">{goal.name}</h6>
                        <span className={`badge ${statusColors[goal.status]} text-white`}>{statusLabels[goal.status]}</span>
                      </div>
                      <div style={{ width: 64, height: 64 }}>
                        <PieChart width={64} height={64}>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={22} outerRadius={30} dataKey="value" startAngle={90} endAngle={-270}>
                            <Cell fill={pct >= 100 ? '#10b981' : '#6366f1'} />
                            <Cell fill="#e5e7eb" />
                          </Pie>
                        </PieChart>
                        <div className="text-center fw-bold" style={{ fontSize: '0.6rem', marginTop: -54 }}>{pct}%</div>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="d-flex justify-content-between small">
                        <span>&euro;{goal.current_amount.toFixed(2)}</span>
                        <span className="fw-semibold">&euro;{goal.target_amount.toFixed(2)}</span>
                      </div>
                      <div className="progress mt-1" style={{ height: 6 }}>
                        <div className={`progress-bar ${pct >= 100 ? 'bg-success' : 'bg-primary'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                    </div>
                    {goal.deadline && <p className="small text-secondary mb-2">&Eacute;ch&eacute;ance: {new Date(goal.deadline).toLocaleDateString('fr-FR')}</p>}
                    {goal.description && <p className="small text-secondary mb-2">{goal.description}</p>}
                    <div className="d-flex gap-2 mt-3 pt-3 border-top flex-wrap">
                      {goal.status === 'in_progress' && (
                        <Button size="sm" onClick={() => { setAddModal(goal); setAddValue(''); }}>+ Ajouter</Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => openEdit(goal)}>Modifier</Button>
                      <Button variant="ghost" size="sm" className="text-danger" onClick={() => setDeleteId(goal.id)}>Supprimer</Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier l'objectif" : 'Nouvel objectif'}>
        <form onSubmit={form.handleSubmit(submitForm)}>
          <Input label="Nom" register={form.register('name')} error={form.formState.errors.name?.message} placeholder="Ex: Voyage à Paris" />
          <Input label="Montant objectif" type="number" step="0.01" register={form.register('target_amount')} error={form.formState.errors.target_amount?.message} />
          <Input label="Montant actuel" type="number" step="0.01" register={form.register('current_amount')} error={form.formState.errors.current_amount?.message} />
          <Input label="Date d'échéance" type="date" register={form.register('deadline')} error={form.formState.errors.deadline?.message} />
          <Input label="Description" register={form.register('description')} error={form.formState.errors.description?.message} />
          <div className="d-flex gap-2 mt-3">
            <Button type="submit" loading={saving}>{editing ? 'Enregistrer' : 'Créer'}</Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>

      {/* Add Amount Modal */}
      <Modal isOpen={addModal !== null} onClose={() => setAddModal(null)} title="Ajouter au montant">
        <p className="small text-secondary">Ajouter un montant &agrave; <strong>{addModal?.name}</strong></p>
        <div className="mb-3">
          <label className="form-label fw-semibold small">Montant &agrave; ajouter</label>
          <input type="number" step="0.01" className="form-control" value={addValue} onChange={(e) => setAddValue(e.target.value)} placeholder="Ex: 50" />
        </div>
        <div className="d-flex gap-2">
          <Button onClick={handleAddAmount} loading={addingAmount} disabled={!addValue}>Ajouter</Button>
          <Button variant="secondary" onClick={() => setAddModal(null)}>Annuler</Button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Confirmer la suppression">
        <p>Êtes-vous sûr de vouloir supprimer cet objectif ?</p>
        <div className="d-flex gap-2">
          <Button variant="danger" onClick={confirmDelete} loading={deleting}>Supprimer</Button>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Annuler</Button>
        </div>
      </Modal>
    </div>
  );
}
