import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from './ProductSkeleton';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { ArrowRight, Flame } from 'lucide-react';

export function DiscountedProducts() {
  const { t } = useLanguage();
  const { products, loading, error } = useProducts();
  const discounted = useMemo(
    () => products.filter(p => p.discount_price != null).slice(0, 4),
    [products]
  );

  if (!loading && discounted.length === 0) return null;

  return (
    <section className="py-24 bg-background">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-12 gap-4 flex-wrap">
          <div>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-destructive font-semibold mb-3">
              <Flame className="w-3.5 h-3.5" /> Limited
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-foreground flex items-center gap-4">
              {t('nav.discounts')}
              <span className="bg-destructive/15 text-destructive text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Sale
              </span>
            </h2>
          </div>
          <Link to="/discounts" className="btn-outline-gold">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : error ? (
          <div className="text-center py-12 text-muted-foreground">
            No discounted products at the moment. Check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {discounted.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
