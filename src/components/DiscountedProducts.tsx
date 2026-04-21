import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from './ProductSkeleton';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';

export function DiscountedProducts() {
  const { t } = useLanguage();
  const { products, loading, error } = useProducts();
  const discounted = useMemo(
    () => products.filter(p => p.discount_price != null).slice(0, 4),
    [products]
  );

  if (!loading && discounted.length === 0) return null;

  return (
    <section className="py-28 bg-background relative overflow-hidden">
      {/* Massive watermark SALE */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span
          className="font-display font-black italic text-[28vw] leading-none whitespace-nowrap"
          style={{
            transform: 'rotate(-12deg)',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(232,201,126,0.06)',
          }}
        >
          SALE SALE
        </span>
      </div>

      <div className="container-custom relative">
        <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
          <div>
            <span className="label-eyebrow text-destructive" style={{ color: 'hsl(var(--destructive))' }}>— Limited Time</span>
            <h2 className="text-5xl sm:text-6xl font-display font-light text-foreground mt-3 leading-none">
              On <span className="italic text-gold-gradient font-black">sale</span> now
            </h2>
          </div>
          <Link to="/discounts" className="btn-outline-gold">View all</Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : error ? (
          <div className="text-center py-12 text-muted-foreground">No discounts at the moment.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {discounted.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
