import { useLanguage } from '@/contexts/LanguageContext';
import { reviews } from '@/data/reviews';
import { Star, Quote } from 'lucide-react';

export function Reviews() {
  const { lang, t } = useLanguage();

  return (
    <section className="py-28 bg-surface">
      <div className="container-custom">
        <div className="mb-14">
          <span className="label-eyebrow">— Testimonials</span>
          <h2 className="text-5xl sm:text-6xl font-display font-light text-foreground mt-3 leading-none">
            What clients <span className="italic text-gold-gradient font-black">say</span>
          </h2>
        </div>

        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6
                     overflow-x-auto sm:overflow-visible snap-x snap-mandatory
                     -mx-4 px-4 sm:mx-0 sm:px-0
                     grid-flow-col sm:grid-flow-row auto-cols-[85%] sm:auto-cols-auto"
        >
          {reviews.map(r => (
            <article
              key={r.id}
              className="card-museum p-8 snap-start min-w-0 flex flex-col"
            >
              <Quote className="w-7 h-7 text-accent/30 mb-4" strokeWidth={1.5} />
              <p className="font-display italic text-xl text-foreground leading-snug mb-6 flex-1">
                "{r.text[lang]}"
              </p>
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < r.rating ? 'text-accent fill-accent' : 'text-white/10'}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3 pt-5 border-t border-white/[0.06]">
                <div className="w-9 h-9 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent text-sm font-medium">
                  {r.name[0]}
                </div>
                <div>
                  <p className="text-sm text-foreground font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.date}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
