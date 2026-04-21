import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ChevronDown } from 'lucide-react';

const Phone3D = lazy(() => import('./Phone3D'));

function Reveal({ words, delayBase = 0 }: { words: string[]; delayBase?: number }) {
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className="word-reveal mr-[0.18em]">
          <span style={{ animationDelay: `${delayBase + i * 0.08}s` }}>{w}</span>
        </span>
      ))}
    </>
  );
}

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center hero-bg overflow-hidden">
      {/* Drifting gradient blobs */}
      <div
        className="blob"
        style={{
          width: '720px', height: '720px',
          top: '-20%', left: '-10%',
          background: 'radial-gradient(circle, rgba(232,201,126,0.35), transparent 60%)',
          animation: 'blob-1 20s ease-in-out infinite alternate',
        }}
      />
      <div
        className="blob"
        style={{
          width: '680px', height: '680px',
          bottom: '-15%', right: '-10%',
          background: 'radial-gradient(circle, rgba(192,132,252,0.28), transparent 60%)',
          animation: 'blob-2 22s ease-in-out infinite alternate',
        }}
      />
      <div
        className="blob"
        style={{
          width: '600px', height: '600px',
          top: '20%', right: '15%',
          background: 'radial-gradient(circle, rgba(60,90,180,0.25), transparent 60%)',
          animation: 'blob-3 24s ease-in-out infinite alternate',
        }}
      />

      <div className="relative container-custom pt-32 pb-24 lg:pt-40 lg:pb-32 w-full z-10">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center">
          <div className="max-w-2xl">
            <span
              className="label-eyebrow opacity-0 mb-7 block"
              style={{ animation: 'fade-up 0.7s 0.1s forwards' }}
            >
              — Premium Accessories
            </span>

            <h1 className="font-display leading-[0.92] mb-8 text-[3.5rem] sm:text-[5rem] lg:text-[7rem] xl:text-[8.5rem]">
              <span className="block font-light text-foreground">
                <Reveal words={['Wear', 'the']} delayBase={0.2} />
              </span>
              <span className="block italic font-black text-gold-gradient">
                <Reveal words={['Extraordinary']} delayBase={0.45} />
              </span>
            </h1>

            <p
              className="text-base sm:text-lg text-muted-foreground mb-10 max-w-md leading-relaxed opacity-0 font-light"
              style={{ animation: 'fade-up 0.7s 1s forwards' }}
            >
              {t('hero.subtitle')}
            </p>

            <div
              className="flex flex-wrap gap-3 opacity-0"
              style={{ animation: 'fade-up 0.7s 1.2s forwards' }}
            >
              <Link to="/products" className="btn-gold">{t('hero.shopNow')}</Link>
              <a href="#categories" className="btn-outline-gold">{t('hero.viewCategories')}</a>
            </div>
          </div>

          <div className="relative h-[420px] sm:h-[520px] lg:h-[620px]">
            {/* Vignette mask wrapper */}
            <div
              className="absolute inset-0"
              style={{
                maskImage: 'radial-gradient(ellipse at center, #000 55%, transparent 90%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, #000 55%, transparent 90%)',
              }}
            >
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
      </div>

      {/* Marquee */}
      <div className="absolute bottom-12 inset-x-0 marquee text-muted-foreground/60 text-xs uppercase z-10" style={{ letterSpacing: '0.24em' }}>
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="inline-flex items-center gap-12 pr-12">
              <span>Free Shipping</span><span className="text-accent">·</span>
              <span>Premium Quality</span><span className="text-accent">·</span>
              <span>Azerbaijan</span><span className="text-accent">·</span>
              <span>New Arrivals</span><span className="text-accent">·</span>
              <span>Free Shipping</span><span className="text-accent">·</span>
              <span>Premium Quality</span><span className="text-accent">·</span>
              <span>Azerbaijan</span><span className="text-accent">·</span>
              <span>New Arrivals</span><span className="text-accent">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#categories"
        className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground hover:text-accent z-10"
        aria-label="Scroll"
      >
        <ChevronDown className="w-4 h-4" style={{ animation: 'bounce-soft 2s ease-in-out infinite' }} />
      </a>
    </section>
  );
}
