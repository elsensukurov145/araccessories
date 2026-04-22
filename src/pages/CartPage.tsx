import { Link, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

const PLACEHOLDER_IMG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"%3E%3Crect fill="%230f0f15" width="80" height="80"/%3E%3C/svg%3E';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', surname: '', phone: '', address: '' });

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!form.name || !form.surname || !form.phone || !form.address) {
      toast({ title: t('cart.missingInfo'), description: t('cart.fillAllFields'), variant: 'destructive' });
      return;
    }
    setSubmitting(true);

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        email: user.email,
        name: form.name,
        surname: form.surname,
        phone: form.phone,
        address: form.address,
        total,
      })
      .select()
      .single();

    if (orderErr || !order) {
      setSubmitting(false);
      toast({ title: t('cart.orderFailed'), description: orderErr?.message || t('cart.tryAgain'), variant: 'destructive' });
      return;
    }

    const { error: itemsErr } = await supabase.from('order_items').insert(
      items.map(it => ({
        order_id: order.id,
        product_id: it.id,
        name: it?.name?.[lang] || it?.name?.az || '',
        price: it.discount_price || it.price,
        quantity: it.quantity,
        selected_color: it.selectedColor,
      }))
    );

    setSubmitting(false);
    if (itemsErr) {
      toast({ title: t('cart.orderFailed'), description: itemsErr.message, variant: 'destructive' });
      return;
    }

    clearCart();
    toast({ title: t('cart.orderPlaced'), description: t('cart.contactSoon') });
    navigate('/orders');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container-custom pt-28 pb-12">
        <h1 className="text-3xl font-bold font-display mb-8">{t('cart.title')}</h1>
        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground mb-6">{t('cart.empty')}</p>
            <Link to="/products" className="inline-flex items-center px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold">
              {t('cart.browseProducts')}
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.cartId} className="flex gap-4 p-4 bg-card border border-border rounded-xl">
                  <img
                    src={item.image_url || PLACEHOLDER_IMG}
                    alt=""
                    className="w-20 h-20 object-cover rounded-lg bg-muted"
                    onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMG; }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm line-clamp-2">{item?.name?.[lang] || item?.name?.az}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{t('cart.color')}: {item.selectedColor}</p>
                    <p className="text-accent font-bold mt-1">{(item.discount_price || item.price)} {t('currency')}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeFromCart(item.cartId)} className="text-destructive p-2 min-w-[44px] min-h-[44px] flex items-center justify-center" aria-label={t('cart.remove')}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center" aria-label="-">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="w-9 h-9 rounded-lg border border-border flex items-center justify-center" aria-label="+">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-6 sticky top-20">
                <h2 className="text-lg font-bold mb-4">{t('cart.orderSummary')}</h2>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                  <span>{total.toFixed(2)} {t('currency')}</span>
                </div>
                <div className="flex justify-between mb-4 text-sm">
                  <span className="text-muted-foreground">{t('cart.shipping')}</span>
                  <span className="text-success">{t('cart.free')}</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                  <span>{t('cart.total')}</span>
                  <span>{total.toFixed(2)} {t('currency')}</span>
                </div>

                {user ? (
                  <div className="mt-6 space-y-3">
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder={t('cart.name')} className="w-full px-3 py-2.5 min-h-[44px] rounded-lg border border-border bg-background text-sm" />
                    <input value={form.surname} onChange={e => setForm({ ...form, surname: e.target.value })} placeholder={t('cart.surname')} className="w-full px-3 py-2.5 min-h-[44px] rounded-lg border border-border bg-background text-sm" />
                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder={t('cart.phone')} className="w-full px-3 py-2.5 min-h-[44px] rounded-lg border border-border bg-background text-sm" />
                    <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder={t('cart.address')} className="w-full px-3 py-2.5 min-h-[44px] rounded-lg border border-border bg-background text-sm" />
                    <Button onClick={handleCheckout} disabled={submitting} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 min-h-[44px]">
                      {submitting ? t('cart.checkoutSubmitting') : t('cart.checkout')}
                    </Button>
                  </div>
                ) : (
                  <Link to="/login" className="mt-6 block w-full text-center px-4 py-3 min-h-[44px] bg-accent text-accent-foreground rounded-lg font-semibold">
                    {t('cart.signInToCheckout')}
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
