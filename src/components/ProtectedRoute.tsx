import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import logo from '../assets/logo.png';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, initialized } = useAuthStore();

  if (!initialized) {
    return (
      <div className="loader-screen">
        <img src={logo} alt="MADINDA" className="loader-logo" />
        <div className="loader-spinner" />
        <p className="loader-text">Chargement...</p>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
