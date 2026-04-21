import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[hsl(0_0%_2%)] text-foreground border-t border-border/40">
      <div className="container-custom py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link to="/" className="text-2xl font-bold font-display block mb-4">
              ar_<span className="text-accent italic">accessories</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">{t('footer.aboutText')}</p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/ar_accessoriess_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-accent hover:text-accent hover:bg-accent/5"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-accent hover:text-accent hover:bg-accent/5"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg mb-5 text-foreground">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              {[
                { label: t('footer.delivery'), href: '#' },
                { label: t('footer.warranty'), href: '#' },
                { label: t('footer.returnPolicy'), href: '#' },
                { label: t('footer.privacyPolicy'), href: '#' },
              ].map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-accent inline-block">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg mb-5 text-foreground">{t('footer.contactInfo')}</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                <span>{t('footer.address')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0 text-accent" />
                <span>{t('footer.phone')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 shrink-0 text-accent" />
                <span>{t('footer.email')}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg mb-5 text-foreground">{t('footer.workingHours')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
                <div className="space-y-1">
                  <p>{t('footer.weekdays')}</p>
                  <p>{t('footer.weekend')}</p>
                  <p>{t('footer.sunday')}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border/40">
        <div className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© 2025 ar_accessories. {t('footer.rights')}</p>
          <p className="text-xs text-muted-foreground">Crafted with <span className="text-accent">♦</span> Premium</p>
        </div>
      </div>
    </footer>
  );
}
