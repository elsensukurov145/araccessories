import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

const Phone3D = lazy(() => import('./Phone3D'));

function RevealHeading({ text, delayBase = 0 }: { text: string; delayBase?: number }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className="word-reveal mr-[0.25em]">
          <span style={{ animationDelay: `${delayBase + i * 0.08}s` }}>{w}</span>
        </span>
      ))}
    </>
  );
}

export function Hero() {
  const { t } = useLanguage();
  const title = t('hero.title') || 'Premium Accessories\nfor Modern Devices';
  const [line1, line2] = title.includes('\n') ? title.split('\n') : [title, ''];

  return (
    <section className="relative min-h-screen flex items-center hero-bg overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--accent)/0.12),transparent_60%)] pointer-events-none" />

      <div className="relative container-custom py-20 lg:py-28 w-full">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
          <div className="max-w-2xl">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent border border-accent/30 rounded-full backdrop-blur opacity-0"
              style={{ animation: 'fade-up 0.7s 0.1s forwards' }}
            >
              <Sparkles className="w-3 h-3" /> Premium Quality
            </span>

            <h1 className="font-display font-bold text-foreground leading-[1.02] mb-6 text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
              <span className="block">
                <RevealHeading text={line1} delayBase={0.2} />
              </span>
              {line2 && (
                <span className="block text-accent italic">
                  <RevealHeading text={line2} delayBase={0.5} />
                </span>
              )}
            </h1>

            <p
              className="text-base sm:text-lg text-muted-foreground mb-10 max-w-lg leading-relaxed opacity-0"
              style={{ animation: 'fade-up 0.7s 0.9s forwards' }}
            >
              {t('hero.subtitle')}
            </p>

            <div
              className="flex flex-wrap gap-3 opacity-0"
              style={{ animation: 'fade-up 0.7s 1.1s forwards' }}
            >
              <Link to="/products" className="btn-gold">
                {t('hero.shopNow')}
              </Link>
              <a href="#categories" className="btn-outline-gold">
                {t('hero.viewCategories')}
              </a>
            </div>
          </div>

          {/* 3D phone with floating glow */}
          <div className="relative h-[420px] sm:h-[520px] lg:h-[620px]">
            {/* Pulsing glow under phone */}
            <div
              className="absolute left-1/2 bottom-10 w-[80%] h-32 rounded-full bg-accent/30 blur-3xl pointer-events-none"
              style={{ animation: 'pulse-glow 4s ease-in-out infinite', transform: 'translate(-50%, 0)' }}
            />
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-32 h-64 rounded-3xl bg-foreground/5 animate-pulse" />
                </div>
              }
            >
              <Phone3D />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#categories"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground hover:text-accent"
        aria-label="Scroll down"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown className="w-5 h-5" style={{ animation: 'bounce-soft 2s ease-in-out infinite' }} />
      </a>
    </section>
  );
}
