import { Link } from 'react-router-dom';

export default function BlogPage() {
  return (
    <section className="page-placeholder">
      <h1>Blog</h1>
      <p>Articles et conseils sur la gestion budgétaire familiale (bientôt disponible).</p>
      <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
    </section>
  );
}
