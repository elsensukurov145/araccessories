import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types/product';
import { ShoppingBag, Check } from 'lucide-react';
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
    <div className="card-premium group">
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image_url}
          alt={product.name[lang] || product.name.az}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          width={400}
          height={400}
          onError={(e) => {
            const el = e.target as HTMLImageElement;
            el.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23111" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="16" fill="%23666" text-anchor="middle" dy=".3em"%3ENo image%3C/text%3E%3C/svg%3E';
          }}
        />
        {/* gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.discount_price && (
            <span className="px-2.5 py-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full tracking-wider uppercase">
              -{discountPercent}% Sale
            </span>
          )}
          {isNew && !product.discount_price && (
            <span className="px-2.5 py-1 bg-accent text-accent-foreground text-[10px] font-bold rounded-full tracking-wider uppercase">
              New
            </span>
          )}
        </div>

        {!product.in_stock && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center backdrop-blur-sm">
            <span className="bg-foreground text-background px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider">
              {t('products.outOfStock')}
            </span>
          </div>
        )}

        {/* Slide-up Add to Cart on hover */}
        <button
          onClick={handleAddToCart}
          disabled={!product.in_stock || added}
          className={`absolute bottom-3 inset-x-3 z-10 flex items-center justify-center gap-2 h-11 rounded-full text-xs font-semibold uppercase tracking-wider translate-y-16 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400 disabled:opacity-40 ${
            added ? 'bg-success text-success-foreground' : 'bg-accent text-accent-foreground hover:brightness-110'
          }`}
        >
          {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          {added ? 'Added' : t('products.addToCart')}
        </button>
      </Link>

      <div className="p-5">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display text-base text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {product.name[lang] || product.name.az}
          </h3>
        </Link>

        {Array.isArray(product.colors) && product.colors.length > 1 && (
          <div className="flex gap-1.5 mb-3">
            {product.colors.map(color => (
              <button
                key={color}
                onClick={(e) => { e.preventDefault(); setSelectedColor(color); }}
                className={`w-4 h-4 rounded-full border transition-all ${
                  selectedColor === color ? 'border-accent ring-2 ring-accent/30 scale-110' : 'border-border'
                }`}
                style={{ backgroundColor: color === 'transparent' ? '#222' : color }}
                aria-label={`color ${color}`}
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {product.discount_price ? (
              <>
                <span className="text-lg font-semibold text-accent">{product.discount_price} {t('currency')}</span>
                <span className="text-xs text-muted-foreground line-through">{product.price} {t('currency')}</span>
              </>
            ) : (
              <span className="text-lg font-semibold text-foreground">{product.price} {t('currency')}</span>
            )}
          </div>
          <span className={`w-2 h-2 rounded-full ${product.in_stock ? 'bg-success' : 'bg-destructive'}`} />
        </div>
      </div>
    </div>
  );
}

export const ProductCard = memo(ProductCardImpl);
