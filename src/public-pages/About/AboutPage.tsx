import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <section className="page-placeholder">
      <h1>À propos de MADINDA</h1>
      <p>MADINDA Family Budget est une application conçue pour aider les familles à gérer leurs finances.</p>
      <p style={{ maxWidth: 600, marginBottom: 32 }}>
        Notre mission est de simplifier la gestion budgétaire familiale grâce à une interface intuitive et des outils puissants d'analyse financière.
      </p>
      <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
    </section>
  );
}
