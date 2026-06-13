import { Link } from 'react-router-dom';

export default function DownloadPage() {
  return (
    <section className="page-placeholder">
      <h1>Télécharger l'application</h1>
      <p>L'application MADINDA sera bientôt disponible sur le Play Store.</p>
      <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        <Link to="/" className="btn btn-secondary">Retour à l'accueil</Link>
      </div>
    </section>
  );
}
