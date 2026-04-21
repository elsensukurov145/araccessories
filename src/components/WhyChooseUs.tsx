import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Truck, Award, Headphones } from 'lucide-react';

export function WhyChooseUs() {
  const { t } = useLanguage();

  const features = [
    { icon: Shield, title: t('whyUs.quality'), desc: t('whyUs.qualityDesc') },
    { icon: Truck, title: t('whyUs.delivery'), desc: t('whyUs.deliveryDesc') },
    { icon: Award, title: t('whyUs.warranty'), desc: t('whyUs.warrantyDesc') },
    { icon: Headphones, title: t('whyUs.support'), desc: t('whyUs.supportDesc') },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--accent)/0.08),transparent_60%)] pointer-events-none" />
      <div className="container-custom relative">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Why Us</span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-foreground mt-3 mb-4">
            {t('whyUs.title')}
          </h2>
          <p className="text-muted-foreground">{t('whyUs.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="card-premium p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <f.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-display font-bold mb-2 text-foreground">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
