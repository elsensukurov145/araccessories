import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Package } from 'lucide-react';

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
  address: string;
  order_items: { id: string; name: string; quantity: number; price: number; selected_color: string | null }[];
}

const OrdersPage = () => {
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('orders')
        .select('id,total,status,created_at,address, order_items(id,name,quantity,price,selected_color)')
        .order('created_at', { ascending: false });
      if (!cancelled) {
        setOrders((data ?? []) as Order[]);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const statusLabel = (s: string) => {
    const key = 'orders.status' + s.charAt(0).toUpperCase() + s.slice(1);
    const label = t(key);
    return label === key ? s : label;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container-custom pt-28 pb-12">
        <h1 className="text-3xl font-bold font-display mb-8">{t('orders.title')}</h1>
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-40" />
            {t('orders.empty')}
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(o => (
              <div key={o.id} className="bg-card border border-border rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">{t('orders.orderNum')} #{o.id.slice(0, 8)}</p>
                    <p className="text-sm">{new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-semibold uppercase px-2.5 py-1 rounded-full ${
                    o.status === 'completed' || o.status === 'paid' ? 'bg-success/20 text-success' :
                    o.status === 'cancelled' ? 'bg-destructive/20 text-destructive' :
                    'bg-accent/20 text-accent'
                  }`}>{statusLabel(o.status)}</span>
                </div>
                <div className="space-y-2 mb-4">
                  {o.order_items?.map(it => (
                    <div key={it.id} className="flex justify-between text-sm">
                      <span>{it.name} × {it.quantity}</span>
                      <span className="font-semibold">{(it.price * it.quantity).toFixed(2)} {t('currency')}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-3 border-t border-border font-bold">
                  <span>{t('orders.total')}</span>
                  <span>{Number(o.total).toFixed(2)} {t('currency')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OrdersPage;
