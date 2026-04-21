import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from './ProductSkeleton';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';

export function ProductsSection() {
  const { t } = useLanguage();
  const { products, loading, error } = useProducts();
  const featured = useMemo(() => products.slice(0, 8), [products]);

  return (
    <section className="py-28 bg-surface">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
          <div>
            <span className="label-eyebrow">— Featured</span>
            <h2 className="text-5xl sm:text-6xl font-display font-light text-foreground mt-3 leading-none">
              The <span className="italic text-gold-gradient font-black">essentials</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-md text-sm leading-relaxed">{t('products.subtitle')}</p>
          </div>
          <Link to="/products" className="btn-outline-gold">View all</Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : error ? (
          <div className="text-center py-20 text-muted-foreground">No products available.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
