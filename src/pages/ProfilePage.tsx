import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const { user, isLoading } = useAuth();
  const [form, setForm] = useState({ display_name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from('profiles').select('display_name, phone, address').eq('id', user.id).maybeSingle();
      if (data) setForm({ display_name: data.display_name || '', phone: data.phone || '', address: data.address || '' });
      setLoading(false);
    })();
  }, [user]);

  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('profiles').update(form).eq('id', user.id);
    setSaving(false);
    if (error) toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
    else toast({ title: 'Profile saved' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container-custom py-10 max-w-2xl">
        <h1 className="text-3xl font-bold font-display mb-8">My Profile</h1>
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        ) : (
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input value={user.email} disabled className="w-full px-3 py-2.5 min-h-[44px] rounded-lg border border-border bg-muted text-muted-foreground text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Display name</label>
              <input value={form.display_name} onChange={e => setForm({ ...form, display_name: e.target.value })} className="w-full px-3 py-2.5 min-h-[44px] rounded-lg border border-border bg-background text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2.5 min-h-[44px] rounded-lg border border-border bg-background text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Default address</label>
              <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm" />
            </div>
            <Button onClick={handleSave} disabled={saving} className="bg-accent text-accent-foreground hover:bg-accent/90 min-h-[44px]">
              {saving ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
