import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import { authApi } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const profileSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  current_password: z.string().min(1, 'Le mot de passe actuel est requis'),
  new_password: z.string().min(6, 'Minimum 6 caractères'),
  confirm: z.string().min(1, 'La confirmation est requise'),
}).refine((d) => d.new_password === d.confirm, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirm'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuthStore();
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { nom: user?.nom || '', email: user?.email || '', phone: user?.phone || '' },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { current_password: '', new_password: '', confirm: '' },
  });

  const handleProfileSubmit = async (data: ProfileFormData) => {
    setSavingProfile(true);
    setProfileSuccess('');
    setProfileError('');
    try {
      await updateProfile({ nom: data.nom, email: data.email, phone: data.phone || undefined });
      setProfileSuccess('Profil mis à jour avec succès.');
    } catch {
      setProfileError('Erreur lors de la mise à jour du profil.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (data: PasswordFormData) => {
    setSavingPassword(true);
    setPasswordSuccess('');
    setPasswordError('');
    try {
      await authApi.changePassword({ current_password: data.current_password, new_password: data.new_password });
      setPasswordSuccess('Mot de passe modifié avec succès.');
      passwordForm.reset({ current_password: '', new_password: '', confirm: '' });
    } catch {
      setPasswordError('Erreur lors du changement de mot de passe.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div>
      <h1 className="h3 fw-bold mb-4">Mon Profil</h1>

      <div className="row g-4">
        {/* Avatar Card */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm text-center py-4">
            <div className="card-body">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 fs-2 fw-bold" style={{ width: 80, height: 80 }}>
                {(user?.nom || 'U')[0]}
              </div>
              <h5 className="fw-bold mb-1">{user?.nom}</h5>
              <p className="text-secondary small mb-0">{user?.email}</p>
              <span className="badge bg-primary bg-opacity-10 text-primary mt-2">{user?.role}</span>
              <hr />
              <div className="text-start small">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-secondary">Membre depuis</span>
                  <span className="fw-semibold">{user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '-'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Edit */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Informations personnelles</h5>
              {profileSuccess && <div className="alert alert-success py-2">{profileSuccess}</div>}
              {profileError && <div className="alert alert-danger py-2">{profileError}</div>}
              <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)}>
                <Input label="Nom complet" register={profileForm.register('nom')} error={profileForm.formState.errors.nom?.message} />
                <Input label="Email" type="email" register={profileForm.register('email')} error={profileForm.formState.errors.email?.message} />
                <Input label="Téléphone" type="tel" register={profileForm.register('phone')} error={profileForm.formState.errors.phone?.message} placeholder="Non renseigné" />
                <div className="d-flex gap-2">
                  <Button type="submit" loading={savingProfile}>Enregistrer</Button>
                  <Button variant="danger" onClick={logout}>D&eacute;connexion</Button>
                </div>
              </form>
            </div>
          </div>

          {/* Password Change */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">Changer le mot de passe</h5>
              {passwordSuccess && <div className="alert alert-success py-2">{passwordSuccess}</div>}
              {passwordError && <div className="alert alert-danger py-2">{passwordError}</div>}
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}>
                <Input label="Mot de passe actuel" type="password" register={passwordForm.register('current_password')} error={passwordForm.formState.errors.current_password?.message} />
                <Input label="Nouveau mot de passe" type="password" register={passwordForm.register('new_password')} error={passwordForm.formState.errors.new_password?.message} />
                <Input label="Confirmer le mot de passe" type="password" register={passwordForm.register('confirm')} error={passwordForm.formState.errors.confirm?.message} />
                <Button type="submit" loading={savingPassword}>Changer le mot de passe</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
