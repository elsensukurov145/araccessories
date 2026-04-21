import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function FAQ() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
  ];

  return (
    <section className="py-24 bg-[hsl(0_0%_3%)]">
      <div className="container-custom max-w-3xl">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Support</span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-foreground mt-3 mb-4">
            {t('faq.title')}
          </h2>
          <p className="text-muted-foreground">{t('faq.subtitle')}</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const open = openIndex === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border overflow-hidden transition-colors ${
                  open ? 'border-accent/50 bg-card' : 'border-border bg-card/40'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(open ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className={`font-display text-base ${open ? 'text-accent' : 'text-foreground'}`}>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 shrink-0 transition-transform ${open ? 'rotate-180 text-accent' : 'text-muted-foreground'}`} />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-400 ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
