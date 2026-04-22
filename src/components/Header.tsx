import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ShoppingBag, Menu, X, Shield, User, LogOut, Search } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { t } = useLanguage();
  const { itemCount } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Debounced scroll listener
  useEffect(() => {
    let t: number | undefined;
    const onScroll = () => {
      if (t) return;
      t = window.setTimeout(() => {
        setScrolled(window.scrollY > 80);
        t = undefined;
      }, 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (t) clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.products'), href: '/products' },
    { label: t('nav.discounts'), href: '/discounts' },
    { label: t('nav.contact'), href: '/contact' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-[background-color,backdrop-filter,border-color] duration-500 ${
          scrolled ? 'border-b border-white/[0.05]' : 'border-b border-transparent'
        }`}
        style={{
          backgroundColor: scrolled ? 'rgba(8,8,10,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        }}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-[72px]">
            <Link to="/" className="font-body text-lg font-medium tracking-tight" style={{ letterSpacing: '0.02em' }}>
              <span className="text-accent">ar_</span>
              <span className="text-foreground">accessories</span>
            </Link>

            {/* Centered desktop nav */}
            <nav className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="relative text-[12px] font-normal text-muted-foreground hover:text-accent uppercase group"
                  style={{ letterSpacing: '0.08em' }}
                >
                  {link.label}
                  <span className="absolute -bottom-2 left-0 right-0 h-px bg-accent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                to="/cart"
                className="relative w-11 h-11 inline-flex items-center justify-center text-foreground/85 hover:text-accent rounded-full"
                aria-label="Cart"
              >
                <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-accent text-[#08080a] text-[10px] rounded-full flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </Link>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-9 h-9 rounded-full bg-accent/10 text-accent border border-accent/30 flex items-center justify-center text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
                      {user.email.charAt(0).toUpperCase()}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 bg-card border-white/[0.08]">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center"><User className="mr-2 h-4 w-4" />{t('nav.profile')}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="flex items-center"><ShoppingBag className="mr-2 h-4 w-4" />{t('nav.orders')}</Link>
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="flex items-center"><Shield className="mr-2 h-4 w-4 text-accent" />{t('nav.admin')}</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />{t('nav.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  to="/login"
                  className="w-11 h-11 inline-flex items-center justify-center text-foreground/85 hover:text-accent rounded-full"
                  aria-label="Login"
                >
                  <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </Link>
              )}

              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              <button
                onClick={() => setMenuOpen(true)}
                className="lg:hidden w-11 h-11 inline-flex items-center justify-center text-foreground hover:text-accent rounded-full"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen overlay menu */}
      <div
        className={`lg:hidden fixed inset-0 z-50 ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!menuOpen}
      >
        <div
          className="absolute inset-0 bg-background transition-opacity duration-500"
          style={{ opacity: menuOpen ? 1 : 0 }}
        />
        <div className="relative h-full flex flex-col">
          <div className="container-custom flex items-center justify-between h-[72px]">
            <span className="font-body text-lg" style={{ opacity: menuOpen ? 1 : 0, transition: 'opacity 0.4s' }}>
              <span className="text-accent">ar_</span>accessories
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-11 h-11 inline-flex items-center justify-center text-foreground hover:text-accent"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          <form onSubmit={handleSearch} className="container-custom mt-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('nav.search')}
                className="w-full h-12 pl-10 pr-4 rounded-full bg-card border border-white/[0.06] text-sm focus:outline-none focus:border-accent"
              />
            </div>
          </form>

          <nav className="flex-1 container-custom flex flex-col justify-center gap-2 -mt-20">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-4 font-display text-5xl text-foreground hover:text-accent border-b border-white/[0.06]"
                style={{
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.5s ${0.1 + i * 0.08}s, transform 0.5s ${0.1 + i * 0.08}s`,
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="container-custom pb-10 flex items-center justify-between">
            <LanguageSwitcher />
            {!user && (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline-gold">
                {t('nav.signin')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
