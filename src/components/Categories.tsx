import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Smartphone, Plug, Cable, ArrowRight } from 'lucide-react';

export function Categories() {
  const { t } = useLanguage();

  const categories = [
    { key: 'cases', icon: Smartphone, label: t('categories.cases') },
    { key: 'chargers', icon: Plug, label: t('categories.chargers') },
    { key: 'cables', icon: Cable, label: t('categories.cables') },
  ];

  return (
    <section id="categories" className="py-24 bg-background">
      <div className="container-custom">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Collection</span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-foreground mt-3 mb-4">
            {t('categories.title')}
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">{t('categories.subtitle')}</p>
        </div>

        {/* horizontal scroll on mobile, grid on desktop */}
        <div className="flex sm:grid sm:grid-cols-3 gap-5 overflow-x-auto sm:overflow-visible snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 pb-2">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.key}
                to={`/products?category=${cat.key}`}
                className="card-premium group min-w-[260px] sm:min-w-0 snap-start p-8 flex flex-col gap-6"
                style={{ animation: `fade-up 0.6s ${i * 0.1}s both` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-foreground mb-2">{cat.label}</h3>
                  <p className="text-sm text-muted-foreground">{t('categories.subtitle')}</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent">
                  {t('categories.viewAll')}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
