import { useEffect, useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Loader2, ShoppingBag, Users, DollarSign, Package, Pencil, Trash2, Plus } from 'lucide-react';

interface AdminProduct {
  id: string;
  name: any;
  description: any;
  price: number;
  discount_price: number | null;
  category: string;
  image_url: string;
  stock: number;
  status: string;
  in_stock: boolean;
  colors: any;
  specs: any;
  created_at: string;
  updated_at: string;
}

interface AdminOrder {
  id: string;
  email: string;
  name: string;
  surname: string;
  phone: string;
  address: string;
  total: number;
  status: string;
  created_at: string;
}

const AdminPage = () => {
  const { user, isLoading } = useAuth();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [users, setUsers] = useState<{ id: string; email: string; display_name: string | null; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    (async () => {
      const [p, o, u] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('id,email,display_name,created_at').order('created_at', { ascending: false }),
      ]);
      setProducts((p.data ?? []) as AdminProduct[]);
      setOrders((o.data ?? []) as AdminOrder[]);
      setUsers((u.data ?? []) as any);
      setLoading(false);
    })();
  }, [user]);

  const stats = useMemo(() => ({
    totalOrders: orders.length,
    totalRevenue: orders.reduce((s, o) => s + Number(o.total), 0),
    totalUsers: users.length,
    totalProducts: products.length,
  }), [orders, users, products]);

  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) return toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    setOrders(o => o.map(x => x.id === id ? { ...x, status } : x));
    toast({ title: 'Order updated' });
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    setProducts(p => p.filter(x => x.id !== id));
    toast({ title: 'Product deleted' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container-custom py-10">
        <h1 className="text-3xl font-bold font-display mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">Welcome back, {user.email}</p>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" /></div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={ShoppingBag} label="Orders" value={stats.totalOrders} />
              <StatCard icon={DollarSign} label="Revenue" value={`${stats.totalRevenue.toFixed(2)} ₼`} />
              <StatCard icon={Users} label="Users" value={stats.totalUsers} />
              <StatCard icon={Package} label="Products" value={stats.totalProducts} />
            </div>

            <Tabs defaultValue="products">
              <TabsList>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="mt-6">
                <Button onClick={() => setShowNew(true)} className="mb-4 bg-accent text-accent-foreground hover:bg-accent/90">
                  <Plus className="w-4 h-4 mr-2" /> Add Product
                </Button>
                <div className="overflow-x-auto bg-card border border-border rounded-xl">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3">Image</th>
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Category</th>
                        <th className="text-left p-3">Price</th>
                        <th className="text-left p-3">Stock</th>
                        <th className="text-right p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p.id} className="border-t border-border">
                          <td className="p-3"><img src={p.image_url} alt="" className="w-12 h-12 rounded object-cover" /></td>
                          <td className="p-3 font-medium">{(p.name as any)?.az || p.id}</td>
                          <td className="p-3 text-muted-foreground">{p.category}</td>
                          <td className="p-3">{p.price} ₼</td>
                          <td className="p-3">{p.stock}</td>
                          <td className="p-3 text-right">
                            <button onClick={() => setEditing(p)} className="p-2 text-muted-foreground hover:text-accent" aria-label="Edit"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => deleteProduct(p.id)} className="p-2 text-muted-foreground hover:text-destructive" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="mt-6">
                <div className="overflow-x-auto bg-card border border-border rounded-xl">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3">Customer</th>
                        <th className="text-left p-3">Phone</th>
                        <th className="text-left p-3">Total</th>
                        <th className="text-left p-3">Date</th>
                        <th className="text-left p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o.id} className="border-t border-border">
                          <td className="p-3">
                            <div className="font-medium">{o.name} {o.surname}</div>
                            <div className="text-xs text-muted-foreground">{o.email}</div>
                          </td>
                          <td className="p-3">{o.phone}</td>
                          <td className="p-3 font-semibold">{Number(o.total).toFixed(2)} ₼</td>
                          <td className="p-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                          <td className="p-3">
                            <select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)} className="px-2 py-1 rounded border border-border bg-background text-xs">
                              <option value="pending">pending</option>
                              <option value="processing">processing</option>
                              <option value="shipped">shipped</option>
                              <option value="completed">completed</option>
                              <option value="cancelled">cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="users" className="mt-6">
                <div className="overflow-x-auto bg-card border border-border rounded-xl">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Display name</th>
                        <th className="text-left p-3">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} className="border-t border-border">
                          <td className="p-3 font-medium">{u.email}</td>
                          <td className="p-3 text-muted-foreground">{u.display_name || '—'}</td>
                          <td className="p-3 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}

        {(editing || showNew) && (
          <ProductEditor
            product={editing}
            onClose={() => { setEditing(null); setShowNew(false); }}
            onSaved={(prod, isNew) => {
              if (isNew) setProducts(p => [prod, ...p]);
              else setProducts(p => p.map(x => x.id === prod.id ? prod : x));
              setEditing(null); setShowNew(false);
            }}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value }: any) => (
  <div className="bg-card border border-border rounded-xl p-5">
    <Icon className="w-6 h-6 text-accent mb-3" />
    <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

const ProductEditor = ({ product, onClose, onSaved }: { product: AdminProduct | null; onClose: () => void; onSaved: (p: AdminProduct, isNew: boolean) => void }) => {
  const [form, setForm] = useState({
    id: product?.id || '',
    name_az: (product?.name as any)?.az || '',
    description_az: (product?.description as any)?.az || '',
    price: product?.price || 0,
    discount_price: product?.discount_price || 0,
    category: product?.category || 'cases',
    image_url: product?.image_url || '',
    stock: product?.stock || 10,
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const payload = {
      id: form.id || `prod-${Date.now()}`,
      name: { az: form.name_az, ru: form.name_az, en: form.name_az },
      description: { az: form.description_az, ru: form.description_az, en: form.description_az },
      specs: { az: [], ru: [], en: [] },
      colors: [],
      price: Number(form.price),
      discount_price: form.discount_price ? Number(form.discount_price) : null,
      category: form.category,
      image_url: form.image_url,
      stock: Number(form.stock),
      in_stock: Number(form.stock) > 0,
      status: 'active',
    };
    const isNew = !product;
    const { data, error } = isNew
      ? await supabase.from('products').insert(payload).select().single()
      : await supabase.from('products').update(payload).eq('id', product!.id).select().single();
    setSaving(false);
    if (error || !data) return toast({ title: 'Save failed', description: error?.message, variant: 'destructive' });
    onSaved(data as AdminProduct, isNew);
    toast({ title: isNew ? 'Product created' : 'Product updated' });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg space-y-3 my-8" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">{product ? 'Edit product' : 'New product'}</h2>
        <input value={form.name_az} onChange={e => setForm({ ...form, name_az: e.target.value })} placeholder="Name" className="w-full px-3 py-2.5 min-h-[44px] rounded-lg border border-border bg-background text-sm" />
        <textarea value={form.description_az} onChange={e => setForm({ ...form, description_az: e.target.value })} placeholder="Description" rows={3} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm" />
        <div className="grid grid-cols-2 gap-3">
          <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} placeholder="Price" className="px-3 py-2.5 min-h-[44px] rounded-lg border border-border bg-background text-sm" />
          <input type="number" value={form.discount_price} onChange={e => setForm({ ...form, discount_price: Number(e.target.value) })} placeholder="Discount price" className="px-3 py-2.5 min-h-[44px] rounded-lg border border-border bg-background text-sm" />
        </div>
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2.5 min-h-[44px] rounded-lg border border-border bg-background text-sm">
          <option value="cases">Cases</option>
          <option value="chargers">Chargers</option>
          <option value="cables">Cables</option>
        </select>
        <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="Image URL" className="w-full px-3 py-2.5 min-h-[44px] rounded-lg border border-border bg-background text-sm" />
        <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} placeholder="Stock" className="w-full px-3 py-2.5 min-h-[44px] rounded-lg border border-border bg-background text-sm" />
        <div className="flex gap-3 pt-2">
          <Button onClick={save} disabled={saving} className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">{saving ? 'Saving...' : 'Save'}</Button>
          <Button onClick={onClose} variant="outline" className="flex-1">Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
