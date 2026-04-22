import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types/product';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Loader2, Check, ArrowLeft } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { lang, t } = useLanguage();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('status', 'active')
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        setNotFound(true);
      } else {
        const p = data as unknown as Product;
        setProduct(p);
        setSelectedColor(p.colors?.[0] || '');
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [id]);

  const handleAdd = () => {
    if (!product || !product.in_stock) return;
    addToCart(product, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container-custom pt-32 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
          </div>
        ) : notFound || !product ? (
          <div className="text-center py-32">
            <h1 className="font-display text-4xl mb-4 text-foreground">
              {lang === 'az' ? 'Məhsul tapılmadı' : lang === 'ru' ? 'Товар не найден' : 'Product not found'}
            </h1>
            <Link to="/products" className="btn-outline-gold inline-flex items-center gap-2 mt-4">
              <ArrowLeft className="w-4 h-4" />
              {lang === 'az' ? 'Məhsullara qayıt' : lang === 'ru' ? 'К товарам' : 'Back to products'}
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="aspect-square bg-[#0f0f15] rounded-lg overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name[lang] || product.name.az}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%230f0f15" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="14" fill="%236b6b7b" text-anchor="middle" dy=".3em"%3ENo image%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
            <div>
              <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4 leading-tight">
                {product.name[lang] || product.name.az}
              </h1>
              <div className="flex items-baseline gap-3 mb-6">
                {product.discount_price ? (
                  <>
                    <span className="text-3xl text-accent">{product.discount_price} {t('currency')}</span>
                    <span className="text-lg text-muted-foreground line-through">{product.price} {t('currency')}</span>
                  </>
                ) : (
                  <span className="text-3xl text-foreground">{product.price} {t('currency')}</span>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description?.[lang] || product.description?.az}
              </p>

              {Array.isArray(product.colors) && product.colors.length > 0 && (
                <div className="mb-8">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3" style={{ letterSpacing: '0.12em' }}>
                    {lang === 'az' ? 'Rəng' : lang === 'ru' ? 'Цвет' : 'Color'}
                  </div>
                  <div className="flex gap-3">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full transition-all ${
                          selectedColor === color ? 'ring-2 ring-accent ring-offset-4 ring-offset-background' : ''
                        }`}
                        style={{ backgroundColor: color === 'transparent' ? '#222' : color }}
                        aria-label={`color ${color}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleAdd}
                disabled={!product.in_stock || added}
                className={`w-full md:w-auto h-14 px-10 rounded-full text-xs uppercase font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 transition-colors ${
                  added ? 'bg-success text-success-foreground' : 'bg-accent text-[#08080a] hover:bg-[#f0d490]'
                }`}
                style={{ letterSpacing: '0.14em' }}
              >
                {added ? <><Check className="w-4 h-4" /> {t('products.added')}</> : t('products.addToCart')}
              </button>

              {!product.in_stock && (
                <p className="mt-4 text-destructive text-sm">{t('products.outOfStock')}</p>
              )}

              {Array.isArray(product.specs?.[lang]) && product.specs[lang].length > 0 && (
                <div className="mt-10 pt-8 border-t border-border">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-4" style={{ letterSpacing: '0.12em' }}>
                    {lang === 'az' ? 'Xüsusiyyətlər' : lang === 'ru' ? 'Характеристики' : 'Specs'}
                  </div>
                  <ul className="space-y-2 text-sm text-foreground/80">
                    {product.specs[lang].map((s, i) => (
                      <li key={i} className="flex gap-2"><span className="text-accent">·</span> {s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
