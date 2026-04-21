import { useLanguage } from '@/contexts/LanguageContext';
import { reviews } from '@/data/reviews';
import { Star, Quote } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Reviews() {
  const { lang, t } = useLanguage();
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // Auto-advance
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % reviews.length), 6000);
    return () => clearInterval(id);
  }, []);

  const visible = reviews.slice(index, index + 1).concat(
    reviews.slice(0, Math.max(0, index + 1 - reviews.length))
  );

  return (
    <section className="py-24 bg-[hsl(0_0%_3%)]">
      <div className="container-custom">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Testimonials</span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-foreground mt-3 mb-4">
            {t('reviews.title')}
          </h2>
          <p className="text-muted-foreground">{t('reviews.subtitle')}</p>
        </div>

        {/* Carousel — desktop shows 3, mobile shows 1 */}
        <div className="relative">
          <div ref={trackRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map(offset => {
              const r = reviews[(index + offset) % reviews.length];
              return (
                <div key={r.id + offset} className="card-premium p-7 relative">
                  <Quote className="absolute top-5 right-5 w-8 h-8 text-accent/15" />
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < r.rating ? 'text-accent fill-accent' : 'text-border'}`}
                      />
                    ))}
                  </div>
                  <p className="text-foreground/85 text-sm leading-relaxed mb-6 min-h-[80px]">{r.text[lang]}</p>
                  <div className="flex items-center gap-3 pt-5 border-t border-border/50">
                    <div className="w-10 h-10 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent font-bold">
                      {r.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.date}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={() => setIndex(i => (i - 1 + reviews.length) % reviews.length)}
              className="w-10 h-10 rounded-full border border-border hover:border-accent hover:text-accent inline-flex items-center justify-center"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${i === index ? 'w-8 bg-accent' : 'w-1.5 bg-border'}`}
                  aria-label={`Go to ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setIndex(i => (i + 1) % reviews.length)}
              className="w-10 h-10 rounded-full border border-border hover:border-accent hover:text-accent inline-flex items-center justify-center"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
