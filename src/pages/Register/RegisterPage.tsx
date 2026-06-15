import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import logo from '../../assets/logo.png';

export default function RegisterPage() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(nom, email, password);
      navigate('/app');
    } catch {
      setError("Erreur d'inscription");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <img src={logo} alt="MADINDA" className="auth-logo-img" />
          </Link>
          <h1>Créer un compte</h1>
          <p>Rejoignez MADINDA Family Budget</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label htmlFor="nom">Nom complet</label>
            <input id="nom" type="text" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Votre nom" required />
          </div>

          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" required />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Mot de passe</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 caractères" required minLength={6} />
          </div>

          <button type="submit" className="inline-flex items-center justify-center font-medium rounded-lg transition-colors bg-indigo-500 text-white hover:bg-indigo-600 px-6 py-3 text-lg" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Inscription...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="auth-footer-text">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
