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

  const heading =
    lang === 'ru'
      ? 'ТЕХНОЛОГИИ НОВОГО ПОКОЛЕНИЯ'
      : lang === 'en'
      ? 'NEXT GENERATION TECHNOLOGY'
      : 'YENİ NƏSİL TEXNOLOGİYA';

  const subtitle =
    lang === 'ru'
      ? 'Качественные аксессуары. Простой дизайн. Быстрая доставка.'
      : lang === 'en'
      ? 'Quality accessories. Simple design. Fast delivery.'
      : 'Keyfiyyətli aksesuar. Sadə dizayn. Sürətli çatdırılma.';

  const ctaPrimary = lang === 'ru' ? 'Купить сейчас' : lang === 'en' ? 'Shop Now' : 'İndi Al';
  const ctaSecondary = lang === 'ru' ? 'Категории' : lang === 'en' ? 'Categories' : 'Kateqoriyalar';

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
        className="hidden md:block absolute right-0 bottom-0 top-0 w-[55%] max-w-[780px] opacity-0 pointer-events-none z-[1]"
        style={{ animation: 'fade-up 1.4s 0.6s forwards' }}
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
        {/* Subtle radial glow behind heading */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 40% at 50% 45%, rgba(232,201,126,0.10) 0%, transparent 70%)',
          }}
        />

        <div className="relative">
          <div
            className="opacity-0 mb-5 flex items-center gap-4"
            style={{ animation: 'fade-up 0.7s 0.1s forwards' }}
          >
            <span
              className="uppercase text-[11px] font-normal"
              style={{ color: '#e8c97e', letterSpacing: '0.2em' }}
            >
              — AR_ACCESSORIES
            </span>
            <span
              aria-hidden
              className="block h-px"
              style={{ width: '60px', background: '#e8c97e' }}
            />
          </div>

          <h1
            className="mb-8 opacity-0"
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(36px, 8vw, 96px)',
              letterSpacing: '-0.03em',
              lineHeight: 1.02,
              maxWidth: '14ch',
              backgroundImage:
                'linear-gradient(135deg, #ffffff 0%, #a0a0a0 50%, #ffffff 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              animation: 'fade-up 0.9s 0.25s forwards',
            }}
          >
            {heading}
          </h1>

          <p
            className="mb-10 max-w-xl opacity-0 text-base sm:text-lg"
            style={{
              fontFamily: "'DM Sans', system-ui, sans-serif",
              fontWeight: 300,
              color: '#6b6b7b',
              animation: 'fade-up 0.7s 0.7s forwards',
            }}
          >
            {subtitle}
          </p>

          <div
            className="flex flex-col sm:flex-row sm:flex-wrap gap-3 opacity-0"
            style={{ animation: 'fade-up 0.7s 0.95s forwards' }}
          >
            <Link to="/products" className="btn-glass btn-glass-primary w-full sm:w-auto">
              {ctaPrimary}
            </Link>
            <a href="#products" className="btn-glass w-full sm:w-auto">
              {ctaSecondary}
            </a>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div
        className="absolute bottom-12 sm:bottom-16 inset-x-0 marquee text-muted-foreground/70 text-[9px] sm:text-[11px] uppercase z-10"
        style={{ letterSpacing: '0.24em' }}
      >
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="inline-flex items-center gap-8 sm:gap-12 pr-8 sm:pr-12">
              {marqueeItems.concat(marqueeItems).map((item, i) => (
                <span key={i} className="inline-flex items-center gap-8 sm:gap-12">
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
        href="#products"
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground hover:text-accent z-10"
        aria-label="Scroll"
      >
        <ChevronDown className="w-4 h-4" style={{ animation: 'bounce-soft 2s ease-in-out infinite' }} />
      </a>
    </section>
  );
}
