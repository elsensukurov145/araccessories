import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from './ProductSkeleton';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { ArrowRight } from 'lucide-react';

export function ProductsSection() {
  const { t } = useLanguage();
  const { products, loading, error } = useProducts();
  const featured = useMemo(() => products.slice(0, 8), [products]);

  return (
    <section className="py-24 bg-[hsl(0_0%_3%)]">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-12 gap-4 flex-wrap">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Featured</span>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-foreground mt-3">
              {t('products.title')}
            </h2>
            <p className="text-muted-foreground mt-3 max-w-md">{t('products.subtitle')}</p>
          </div>
          <Link to="/products" className="btn-outline-gold">
            {t('categories.viewAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">No products available right now.</p>
            <button onClick={() => window.location.reload()} className="btn-outline-gold">Retry</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
