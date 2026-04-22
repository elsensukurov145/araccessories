import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/ProductSkeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProducts } from '@/hooks/useProducts';
import { Tag, RefreshCw } from 'lucide-react';

const DiscountsPage = () => {
  const { t } = useLanguage();
  const { products, loading, error, refetch } = useProducts();
  const discounted = (products ?? []).filter(p => p?.discount_price);

  return (
    <div className="page-wrapper">
      <Header />
      <main className="page-main container-custom pt-28 pb-12">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-foreground mb-3">{t('products.discountedProducts')}</h1>
        <p className="text-muted-foreground text-lg mb-8">{t('products.discountedSubtitle')}</p>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : error ? (
          <div className="text-center py-20 text-muted-foreground">
            <Tag className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">{t('products.loadError')}</p>
            <button onClick={refetch} className="mt-4 inline-flex items-center gap-2 text-accent hover:text-accent/80 text-sm uppercase" style={{ letterSpacing: '0.12em' }}>
              <RefreshCw className="w-4 h-4" /> {t('products.retry')}
            </button>
          </div>
        ) : discounted.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {discounted.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <Tag className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">{t('products.noDiscounts')}</p>
            <p className="text-sm mt-1">{t('products.noDiscountsHint')}</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DiscountsPage;
