import { useEffect, useState } from 'react';
import useEntityStore from '../../store/entityStore';
import { documentApi } from '../../services/api';
import type { Document } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const documentSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  type: z.string().min(1, 'Le type est requis'),
  file_url: z.string().min(1, "L'URL du fichier est requise"),
});

type DocumentFormData = z.infer<typeof documentSchema>;

const docTypes = ['PDF', 'Excel', 'Word', 'Image', 'Autre'];

const docTypeIcons: Record<string, string> = {
  PDF: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z',
  Excel: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z',
  Word: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z',
  Image: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  Autre: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
};

const docTypeColors: Record<string, string> = {
  PDF: 'text-danger',
  Excel: 'text-success',
  Word: 'text-primary',
  Image: 'text-info',
  Autre: 'text-secondary',
};

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export default function DocumentsPage() {
  const { currentEntity } = useEntityStore();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: { name: '', type: 'PDF', file_url: '' },
  });

  const fetchDocs = async () => {
    if (!currentEntity) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await documentApi.list(currentEntity.id);
      setDocuments(Array.isArray(data) ? data : data.data || data.documents || []);
    } catch {
      setError('Erreur lors du chargement.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocs(); }, [currentEntity]);

  const openCreate = () => {
    form.reset({ name: '', type: 'PDF', file_url: '' });
    setModalOpen(true);
  };

  const submitForm = async (d: DocumentFormData) => {
    if (!currentEntity) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('entity_id', String(currentEntity.id));
      fd.append('name', d.name);
      fd.append('type', d.type);
      fd.append('file_url', d.file_url);
      await documentApi.create(fd);
      setModalOpen(false);
      fetchDocs();
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
      await documentApi.delete(deleteId);
      setDeleteId(null);
      fetchDocs();
    } catch {
      // silent
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" text="Chargement des documents..." />;

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h3 fw-bold mb-0">Documents</h1>
          <p className="text-secondary small mb-0">{documents.length} document(s)</p>
        </div>
        <Button onClick={openCreate}>Uploader un document</Button>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      {documents.length === 0 && !error ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <p className="text-secondary mb-3">Aucun document.</p>
            <Button onClick={openCreate}>Ajouter un document</Button>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {documents.map((doc) => (
            <div key={doc.id} className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={docTypeColors[doc.type] || 'text-secondary'}>
                        <path d={docTypeIcons[doc.type] || docTypeIcons.Autre} />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <h6 className="fw-bold mb-0 text-truncate">{doc.name}</h6>
                      <div className="d-flex gap-2 align-items-center">
                        <span className={`badge bg-opacity-10 ${docTypeColors[doc.type] || 'text-secondary'} bg-secondary`} style={{ fontSize: '0.65rem' }}>{doc.type}</span>
                        <span className="small text-secondary">{formatFileSize(doc.file_size)}</span>
                      </div>
                    </div>
                  </div>
                  {doc.description && <p className="small text-secondary mb-2">{doc.description}</p>}
                  <div className="d-flex gap-2 mt-3 pt-3 border-top">
                    <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">Ouvrir</a>
                    <Button variant="ghost" size="sm" className="text-danger" onClick={() => setDeleteId(doc.id)}>Supprimer</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Ajouter un document">
        <form onSubmit={form.handleSubmit(submitForm)}>
          <Input label="Nom du document" register={form.register('name')} error={form.formState.errors.name?.message} placeholder="Ex: Facture électricité" />
          <Select label="Type" options={docTypes.map((t) => ({ value: t, label: t }))} register={form.register('type')} error={form.formState.errors.type?.message} />
          <Input label="URL du fichier" register={form.register('file_url')} error={form.formState.errors.file_url?.message} placeholder="https://..." />
          <div className="d-flex gap-2 mt-3">
            <Button type="submit" loading={saving}>Ajouter</Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)} title="Confirmer la suppression">
        <p>Êtes-vous sûr de vouloir supprimer ce document ?</p>
        <div className="d-flex gap-2">
          <Button variant="danger" onClick={confirmDelete} loading={deleting}>Supprimer</Button>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Annuler</Button>
        </div>
      </Modal>
    </div>
  );
}
