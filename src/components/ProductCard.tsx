import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types/product';
import { Check } from 'lucide-react';
import { memo, useState } from 'react';

interface ProductCardProps { product: Product; }

function ProductCardImpl({ product }: ProductCardProps) {
  const { lang, t } = useLanguage();
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.in_stock) return;
    addToCart(product, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discountPercent = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0;
  const isNew = new Date(product.created_at).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000;

  return (
    <Link to={`/product/${product.id}`} className="card-museum group block aspect-[3/4] flex flex-col">
      {/* Image — grows to 65% on hover */}
      <div className="relative overflow-hidden h-[55%] group-hover:h-[65%] transition-[height] duration-500 bg-[#0f0f15]">
        <img
          src={product.image_url}
          alt={product.name[lang] || product.name.az}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          width={400}
          height={500}
          onError={(e) => {
            const el = e.target as HTMLImageElement;
            el.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"%3E%3Crect fill="%230f0f15" width="400" height="500"/%3E%3Ctext x="50%25" y="50%25" font-size="14" fill="%236b6b7b" text-anchor="middle" dy=".3em"%3ENo image%3C/text%3E%3C/svg%3E';
          }}
        />
        {/* Inner shadow at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0f0f15] to-transparent pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.discount_price && (
            <span className="px-2.5 py-1 bg-destructive text-destructive-foreground text-[10px] font-medium rounded-full uppercase" style={{ letterSpacing: '0.08em' }}>
              -{discountPercent}%
            </span>
          )}
          {isNew && !product.discount_price && (
            <span className="px-2.5 py-1 glass-pill text-accent text-[10px] font-medium rounded-full uppercase" style={{ letterSpacing: '0.08em' }}>
              {t('products.new')}
            </span>
          )}
        </div>

        {!product.in_stock && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center backdrop-blur-sm">
            <span className="glass-pill text-foreground px-4 py-2 rounded-full text-xs uppercase" style={{ letterSpacing: '0.08em' }}>
              {t('products.outOfStock')}
            </span>
          </div>
        )}

        {/* Add to Cart slide-up text */}
        <div className="absolute bottom-3 inset-x-3 z-10 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <button
            onClick={handleAddToCart}
            disabled={!product.in_stock || added}
            className={`w-full h-11 rounded-full text-[11px] uppercase font-medium flex items-center justify-center gap-2 disabled:opacity-50 ${
              added ? 'bg-success text-success-foreground' : 'bg-accent text-[#08080a] hover:bg-[#f0d490]'
            }`}
            style={{ letterSpacing: '0.12em' }}
          >
            {added ? <><Check className="w-4 h-4" /> {t('products.added')}</> : t('products.addToCart')}
          </button>
        </div>
      </div>

      {/* Bottom info */}
      <div className="flex-1 p-5 flex flex-col">
        <h3 className="font-display text-xl text-foreground mb-1 line-clamp-2 leading-tight">
          {product.name[lang] || product.name.az}
        </h3>

        {Array.isArray(product.colors) && product.colors.length > 1 && (
          <div className="flex gap-2 mb-3 mt-1">
            {product.colors.map(color => (
              <button
                key={color}
                onClick={(e) => { e.preventDefault(); setSelectedColor(color); }}
                className={`w-2 h-2 rounded-full transition-all ${
                  selectedColor === color
                    ? 'ring-2 ring-accent ring-offset-2 ring-offset-card scale-110'
                    : ''
                }`}
                style={{ backgroundColor: color === 'transparent' ? '#222' : color }}
                aria-label={`color ${color}`}
              />
            ))}
          </div>
        )}

        <div className="mt-auto flex items-baseline gap-2">
          {product.discount_price ? (
            <>
              <span className="font-body text-base text-accent">{product.discount_price} {t('currency')}</span>
              <span className="font-body text-xs text-muted-foreground line-through">{product.price} {t('currency')}</span>
            </>
          ) : (
            <span className="font-body text-base text-foreground">{product.price} {t('currency')}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export const ProductCard = memo(ProductCardImpl);
