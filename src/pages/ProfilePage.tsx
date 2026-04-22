import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ProfilePage = () => {
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({ display_name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from('profiles').select('display_name, phone, address').eq('id', user.id).maybeSingle();
      if (!cancelled) {
        if (data) setForm({ display_name: data.display_name || '', phone: data.phone || '', address: data.address || '' });
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('profiles').update(form).eq('id', user.id);
    setSaving(false);
    if (error) toast({ title: t('profile.saveFailed'), description: error.message, variant: 'destructive' });
    else toast({ title: t('profile.saved') });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container-custom pt-28 pb-12 max-w-2xl">
        <h1 className="text-3xl font-bold font-display mb-8">{t('profile.title')}</h1>
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        ) : (
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('profile.email')}</label>
              <input value={user.email} disabled className="w-full px-3 py-2.5 min-h-[44px] rounded-lg border border-border bg-muted text-muted-foreground text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('profile.displayName')}</label>
              <input value={form.display_name} onChange={e => setForm({ ...form, display_name: e.target.value })} className="w-full px-3 py-2.5 min-h-[44px] rounded-lg border border-border bg-background text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('profile.phone')}</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2.5 min-h-[44px] rounded-lg border border-border bg-background text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('profile.defaultAddress')}</label>
              <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm" />
            </div>
            <Button onClick={handleSave} disabled={saving} className="bg-accent text-accent-foreground hover:bg-accent/90 min-h-[44px]">
              {saving ? t('profile.saving') : t('profile.save')}
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
