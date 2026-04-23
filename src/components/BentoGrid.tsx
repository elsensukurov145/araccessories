import { useLanguage } from '@/contexts/LanguageContext';
import { useReveal } from '@/hooks/useReveal';

export function BentoGrid() {
  const { t } = useLanguage();
  const ref = useReveal<HTMLDivElement>();

  const cards = [
    { emoji: '🚀', title: t('bento.delivery.title'), desc: t('bento.delivery.desc') },
    { emoji: '✅', title: t('bento.quality.title'), desc: t('bento.quality.desc') },
    { emoji: '📱', title: t('bento.brands.title'), desc: t('bento.brands.desc') },
    { emoji: '🔒', title: t('bento.payment.title'), desc: t('bento.payment.desc') },
  ];

  return (
    <section className="py-16 sm:py-24 bg-background relative">
      <div className="container-custom">
        <div ref={ref} className="reveal text-center mb-10 sm:mb-14">
          <span className="label-eyebrow">{t('bento.eyebrow')}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mt-3">
            {t('bento.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto reveal-stagger">
          {cards.map((c, i) => (
            <div
              key={i}
              data-reveal-child
              className="bento-card group p-7 sm:p-8"
            >
              <div className="text-4xl mb-4 transition-transform duration-500 group-hover:scale-110">
                {c.emoji}
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-2">
                {c.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
