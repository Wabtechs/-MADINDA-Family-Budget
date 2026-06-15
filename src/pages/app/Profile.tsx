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
      <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>

      <div className="flex flex-wrap gap-6">
        {/* Avatar Card */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl border-0 shadow-sm text-center py-6">
            <div className="p-6">
              <div className="bg-indigo-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold" style={{ width: 80, height: 80 }}>
                {(user?.nom || 'U')[0]}
              </div>
              <h5 className="font-bold mb-1">{user?.nom}</h5>
              <p className="text-gray-500 text-sm mb-0">{user?.email}</p>
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 mt-2">{user?.role}</span>
              <hr />
              <div className="text-start text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-500">Membre depuis</span>
                  <span className="font-semibold">{user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '-'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Edit */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-xl border-0 shadow-sm mb-6">
            <div className="p-6">
              <h5 className="font-bold mb-4">Informations personnelles</h5>
              {profileSuccess && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-lg text-sm">{profileSuccess}</div>}
              {profileError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">{profileError}</div>}
              <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)}>
                <Input label="Nom complet" register={profileForm.register('nom')} error={profileForm.formState.errors.nom?.message} />
                <Input label="Email" type="email" register={profileForm.register('email')} error={profileForm.formState.errors.email?.message} />
                <Input label="Téléphone" type="tel" register={profileForm.register('phone')} error={profileForm.formState.errors.phone?.message} placeholder="Non renseigné" />
                <div className="flex gap-2">
                  <Button type="submit" loading={savingProfile}>Enregistrer</Button>
                  <Button variant="danger" onClick={logout}>Déconnexion</Button>
                </div>
              </form>
            </div>
          </div>

          {/* Password Change */}
          <div className="bg-white rounded-xl border-0 shadow-sm">
            <div className="p-6">
              <h5 className="font-bold mb-4">Changer le mot de passe</h5>
              {passwordSuccess && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-lg text-sm">{passwordSuccess}</div>}
              {passwordError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">{passwordError}</div>}
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
