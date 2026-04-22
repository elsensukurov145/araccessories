import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

function Reveal({ words, delayBase = 0 }: { words: string[]; delayBase?: number }) {
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className="word-reveal mr-[0.08em]">
          <span style={{ animationDelay: `${delayBase + i * 0.08}s` }}>{w}</span>
        </span>
      ))}
    </>
  );
}

export function Hero() {
  const { t, lang } = useLanguage();

  const line1 = lang === 'ru' ? 'АКСЕССУАРЫ' : lang === 'en' ? 'PHONE' : 'TELEFON';
  const line2 = lang === 'ru' ? 'ПРЕМИУМ' : lang === 'en' ? 'EXTRAORDINARY' : 'AKSESUARİ';

  const marqueeItems =
    lang === 'ru'
      ? ['ПРОЗРАЧНОСТЬ', 'КАЧЕСТВО', 'АЗЕРБАЙДЖАН', 'НОВИНКИ', 'БЕСПЛАТНАЯ ДОСТАВКА']
      : lang === 'en'
      ? ['TRANSPARENCY', 'QUALITY', 'AZERBAIJAN', 'NEW ARRIVALS', 'FREE SHIPPING']
      : ['ŞƏFFAFLİQ', 'KEYFİYYƏT', 'AZƏRBAYCAN', 'YENİ GƏLİŞLƏR', 'PULSUZ ÇATDIRILMA'];

  return (
    <section className="relative min-h-screen flex items-center hero-bg overflow-hidden">
      {/* Drifting gradient orbs */}
      <div
        className="blob"
        style={{
          width: '760px', height: '760px',
          top: '-20%', left: '-15%',
          background: 'radial-gradient(circle, rgba(232,201,126,0.40), transparent 60%)',
          animation: 'blob-1 25s ease-in-out infinite alternate',
        }}
      />
      <div
        className="blob"
        style={{
          width: '720px', height: '720px',
          bottom: '-20%', right: '-15%',
          background: 'radial-gradient(circle, rgba(192,132,252,0.30), transparent 60%)',
          animation: 'blob-2 25s ease-in-out infinite alternate',
        }}
      />
      <div
        className="blob"
        style={{
          width: '640px', height: '640px',
          top: '15%', right: '10%',
          background: 'radial-gradient(circle, rgba(40,70,170,0.28), transparent 60%)',
          animation: 'blob-3 25s ease-in-out infinite alternate',
        }}
      />

      {/* Hero image bottom-right (hidden on mobile) */}
      <div
        className="hidden md:block absolute -right-[6%] bottom-0 w-[55%] max-w-[720px] aspect-[4/5] opacity-0 pointer-events-none z-[1]"
        style={{
          animation: 'fade-up 1.4s 0.6s forwards',
          maskImage: 'radial-gradient(ellipse at center, #000 50%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, #000 50%, transparent 85%)',
        }}
        aria-hidden
      >
        <img
          src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900"
          alt=""
          loading="eager"
          width={900}
          height={1125}
          className="w-full h-full object-cover"
          style={{ filter: 'drop-shadow(0 40px 80px rgba(232,201,126,0.15))' }}
        />
        {/* Gradient fade on left edge to blend into dark bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to right, hsl(var(--background)) 0%, hsl(var(--background) / 0.6) 25%, transparent 60%)' }}
        />
      </div>

      <div className="relative container-custom pt-32 pb-28 lg:pt-40 lg:pb-36 w-full z-10">
        <span
          className="label-eyebrow opacity-0 mb-8 block"
          style={{ animation: 'fade-up 0.7s 0.1s forwards' }}
        >
          — ar_accessories
        </span>

        <h1 className="font-display leading-[0.88] mb-10 tracking-[-0.02em]">
          <span
            className="block font-light text-foreground"
            style={{ fontSize: 'clamp(3.5rem, 11vw, 10rem)' }}
          >
            <Reveal words={[line1]} delayBase={0.2} />
          </span>
          <span
            className="block italic font-black text-gold-gradient"
            style={{ fontSize: 'clamp(3.5rem, 11vw, 10rem)' }}
          >
            <Reveal words={[line2]} delayBase={0.4} />
          </span>
        </h1>

        <p
          className="text-base sm:text-lg text-muted-foreground mb-10 max-w-md leading-relaxed opacity-0 font-light"
          style={{ animation: 'fade-up 0.7s 0.95s forwards' }}
        >
          {t('hero.subtitle')}
        </p>

        <div
          className="flex flex-wrap gap-3 opacity-0"
          style={{ animation: 'fade-up 0.7s 1.15s forwards' }}
        >
          <Link to="/products" className="btn-gold">{t('hero.shopNow')}</Link>
          <a href="#categories" className="btn-outline-gold">{t('hero.viewCategories')}</a>
        </div>
      </div>

      {/* Marquee */}
      <div
        className="absolute bottom-16 inset-x-0 marquee text-muted-foreground/70 text-[11px] uppercase z-10"
        style={{ letterSpacing: '0.24em' }}
      >
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="inline-flex items-center gap-12 pr-12">
              {marqueeItems.concat(marqueeItems).map((item, i) => (
                <span key={i} className="inline-flex items-center gap-12">
                  <span>{item}</span>
                  <span className="text-accent">·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#categories"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground hover:text-accent z-10"
        aria-label="Scroll"
      >
        <ChevronDown className="w-4 h-4" style={{ animation: 'bounce-soft 2s ease-in-out infinite' }} />
      </a>
    </section>
  );
}
