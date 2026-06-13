import { Link } from 'react-router-dom';

export default function PricingPage() {
  return (
    <section className="page-placeholder">
      <h1>Nos tarifs</h1>
      <p>Découvrez nos formules adaptées à vos besoins (bientôt disponible).</p>
      <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
    </section>
  );
}
