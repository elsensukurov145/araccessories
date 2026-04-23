import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Smartphone, Plug, Cable, ArrowUpRight } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

export function Categories() {
  const { t } = useLanguage();
  const headerRef = useReveal<HTMLDivElement>();
  const pillsRef = useReveal<HTMLDivElement>();

  const categories = [
    { key: 'cases', icon: Smartphone, label: t('categories.cases') },
    { key: 'chargers', icon: Plug, label: t('categories.chargers') },
    { key: 'cables', icon: Cable, label: t('categories.cables') },
  ];

  return (
    <section id="categories" className="py-28 bg-background relative">
      <div className="container-custom">
        <div ref={headerRef} className="reveal flex items-end justify-between mb-14 flex-wrap gap-6">
          <div>
            <span className="label-eyebrow">— {t('categories.collection')}</span>
            <h2 className="text-5xl sm:text-6xl font-display font-light text-foreground mt-3 leading-none">
              {t('categories.shopByPrefix')} <span className="italic text-gold-gradient font-black">{t('categories.shopBy')}</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">{t('categories.subtitle')}</p>
        </div>

        <div ref={pillsRef} className="flex flex-wrap gap-3 sm:gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.key}
                to={`/products?category=${cat.key}`}
                data-reveal-child
                className="glass-pill group inline-flex items-center gap-3 px-6 py-4 rounded-full hover:border-accent/60 hover:text-accent transition-colors"
              >
                <Icon className="w-4 h-4 text-accent group-hover:text-accent" strokeWidth={1.5} />
                <span className="font-body text-sm uppercase tracking-[0.12em] text-foreground group-hover:text-accent">
                  {cat.label}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={1.5} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
