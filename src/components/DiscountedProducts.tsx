import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from './ProductSkeleton';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';

export function DiscountedProducts() {
  const { t } = useLanguage();
  const { products, loading } = useProducts();
  const discounted = useMemo(
    () => products.filter(p => p?.discount_price != null).slice(0, 4),
    [products]
  );

  if (!loading && discounted.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 lg:py-28 bg-background relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span
          className="font-display font-black italic text-[24vw] sm:text-[28vw] leading-none whitespace-nowrap"
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
        <div className="flex items-end justify-between mb-10 sm:mb-14 flex-wrap gap-4 sm:gap-6">
          <div>
            <span className="label-eyebrow" style={{ color: 'hsl(var(--destructive))' }}>— {t('products.onSale')}</span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-light text-foreground mt-3 leading-none">
              {t('products.onSaleTitle')}{' '}
              <span className="italic text-gold-gradient font-black">{t('products.onSaleAccent')}</span>
            </h2>
          </div>
          <Link to="/discounts" className="btn-outline-gold w-full sm:w-auto">{t('products.viewAllBtn')}</Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {discounted.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
