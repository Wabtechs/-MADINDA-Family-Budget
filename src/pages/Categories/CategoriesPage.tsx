import { useState, useEffect } from 'react';
import { categoryApi } from '../../services/api';
import type { Category } from '../../types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryApi.list('expense')
      .then(({ data }) => setCategories(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading"><div className="loader-spinner" /><span>Chargement...</span></div>;

  return (
    <div className="categories-page">
      <div className="page-header">
        <h1>Catégories</h1>
      </div>

      <div className="categories-grid">
        {categories.map((cat) => (
          <div key={cat.id} className="category-card">
            <div className="category-card-icon">{cat.icone}</div>
            <div className="category-card-name">{cat.nom}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
