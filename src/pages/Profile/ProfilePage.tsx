import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Profil</h1>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          {user?.nom?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <h2 className="profile-name">{user?.nom}</h2>
        <p className="profile-email">{user?.email}</p>
        <span className="profile-role">{user?.role === 'admin' ? 'Administrateur' : 'Membre'}</span>
      </div>

      <div className="profile-actions">
        <Link to="/" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
          Site public
        </Link>
        <button className="btn btn-outline" onClick={logout} style={{ width: '100%', justifyContent: 'center' }}>
          Déconnexion
        </button>
      </div>
    </div>
  );
}
