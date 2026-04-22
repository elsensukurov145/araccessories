import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from './ProductSkeleton';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { PackageOpen, RefreshCw } from 'lucide-react';

export function ProductsSection() {
  const { t } = useLanguage();
  const { products, loading, error, refetch } = useProducts();
  const featured = useMemo(() => products.slice(0, 8), [products]);

  return (
    <section className="py-28 bg-surface">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
          <div>
            <span className="label-eyebrow">— {t('products.featured')}</span>
            <h2 className="text-5xl sm:text-6xl font-display font-light text-foreground mt-3 leading-none">
              {t('products.featuredTitle')}{' '}
              <span className="italic text-gold-gradient font-black">{t('products.featuredAccent')}</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-md text-sm leading-relaxed">{t('products.subtitle')}</p>
          </div>
          <Link to="/products" className="btn-outline-gold">{t('products.viewAllBtn')}</Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : error || featured.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <PackageOpen className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium mb-1">{error ? t('products.loadError') : t('products.empty')}</p>
            <button
              onClick={refetch}
              className="mt-4 inline-flex items-center gap-2 text-accent hover:text-accent/80 text-sm uppercase"
              style={{ letterSpacing: '0.12em' }}
            >
              <RefreshCw className="w-4 h-4" /> {t('products.retry')}
            </button>
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
