import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Phone3D = lazy(() => import('./Phone3D'));

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80">
      {/* Decorative gradient blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative container-custom py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="max-w-xl animate-fade-in">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold uppercase tracking-widest text-accent border border-accent/30 rounded-full">
              Premium Quality
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display text-primary-foreground leading-[1.05] mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-base sm:text-lg text-primary-foreground/75 mb-8 font-body leading-relaxed max-w-md">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center px-7 py-3.5 min-h-[44px] bg-accent text-accent-foreground font-semibold rounded-lg hover:brightness-110 transition-all text-sm shadow-lg shadow-accent/20"
              >
                {t('hero.shopNow')}
              </Link>
              <a
                href="#categories"
                className="inline-flex items-center px-7 py-3.5 min-h-[44px] border-2 border-primary-foreground/30 text-primary-foreground font-semibold rounded-lg hover:bg-primary-foreground/10 transition-all text-sm"
              >
                {t('hero.viewCategories')}
              </a>
            </div>
          </div>

          {/* 3D phone */}
          <div className="relative h-[400px] sm:h-[500px] lg:h-[600px]">
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-32 h-64 rounded-2xl bg-primary-foreground/5 animate-pulse" />
              </div>
            }>
              <Phone3D />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
