import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#050507] text-foreground relative">
      <div className="footer-divider" />

      <div className="container-custom py-20">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2 lg:pr-8">
            <Link to="/" className="font-body text-xl block mb-5">
              <span className="text-accent">ar_</span>
              <span className="text-foreground">accessories</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm font-light">
              {t('footer.aboutText')}
            </p>
            <div className="flex gap-2 mt-7">
              {[
                { Icon: Instagram, href: 'https://www.instagram.com/ar_accessoriess_' },
                { Icon: Facebook, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Youtube, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/[0.08] inline-flex items-center justify-center text-muted-foreground hover:text-[#08080a] hover:bg-accent hover:border-accent transition-colors"
                  aria-label="social"
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="label-caps text-foreground mb-5">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              {[t('footer.delivery'), t('footer.warranty'), t('footer.returnPolicy'), t('footer.privacyPolicy')].map(l => (
                <li key={l}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-accent">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="label-caps text-foreground mb-5">{t('footer.contactInfo')}</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-accent" strokeWidth={1.5} />
                <span>{t('footer.address')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 shrink-0 text-accent" strokeWidth={1.5} />
                <span>{t('footer.phone')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 shrink-0 text-accent" strokeWidth={1.5} />
                <span>{t('footer.email')}</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="label-caps text-foreground mb-5">{t('footer.workingHours')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-accent" strokeWidth={1.5} />
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

      <div className="border-t border-white/[0.04]">
        <div className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] text-muted-foreground uppercase" style={{ letterSpacing: '0.24em' }}>
            © 2025 ar_accessories — {t('footer.rights')}
          </p>
          <p className="text-[10px] text-muted-foreground uppercase" style={{ letterSpacing: '0.24em' }}>
            {t('footer.craftedIn')}
          </p>
        </div>
      </div>
    </footer>
  );
}
