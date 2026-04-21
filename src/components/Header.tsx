import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ShoppingBag, Menu, X, Shield, User, LogOut, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { t } = useLanguage();
  const { itemCount } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock scroll when drawer open
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
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-background/85 backdrop-blur-xl border-b border-border/60 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.6)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <span className="font-display text-2xl font-bold tracking-tight text-foreground">
                ar_<span className="text-accent italic">accessories</span>
              </span>
            </Link>

            {/* Desktop Nav (centered) */}
            <nav className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="relative text-sm font-medium text-muted-foreground hover:text-accent group"
                >
                  {link.label}
                  <span className="absolute -bottom-1.5 left-0 right-0 h-px bg-accent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-400" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                to="/cart"
                className="relative w-10 h-10 inline-flex items-center justify-center text-foreground/85 hover:text-accent rounded-full hover:bg-accent/10"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </Link>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-9 h-9 rounded-full bg-accent/15 text-accent border border-accent/30 flex items-center justify-center text-sm font-bold hover:bg-accent hover:text-accent-foreground">
                      {user.email.charAt(0).toUpperCase()}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 bg-card border-border">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center"><User className="mr-2 h-4 w-4" />Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="flex items-center"><ShoppingBag className="mr-2 h-4 w-4" />Orders</Link>
                    </DropdownMenuItem>
                    {user.role === 'admin' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="flex items-center"><Shield className="mr-2 h-4 w-4 text-accent" />Admin Panel</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  to="/login"
                  className="w-10 h-10 inline-flex items-center justify-center text-foreground/85 hover:text-accent rounded-full hover:bg-accent/10"
                  aria-label="Login"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}

              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              <button
                onClick={() => setMenuOpen(true)}
                className="lg:hidden w-10 h-10 inline-flex items-center justify-center text-foreground hover:text-accent rounded-full"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] transition-opacity duration-400 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!menuOpen}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
        {/* Drawer */}
        <aside
          className={`absolute top-0 right-0 h-full w-[85%] max-w-sm bg-card border-l border-border shadow-2xl flex flex-col transition-transform duration-400 ease-out ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-6 h-20 border-b border-border">
            <span className="font-display text-xl font-bold">Menu</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="w-10 h-10 rounded-full inline-flex items-center justify-center hover:bg-accent/10 hover:text-accent"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSearch} className="px-6 pt-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('nav.search') || 'Search products...'}
                className="w-full h-11 pl-10 pr-4 rounded-full bg-secondary border border-border text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
              />
            </div>
          </form>
          <nav className="flex-1 overflow-y-auto px-6 pt-6 flex flex-col gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-4 min-h-[44px] text-lg font-display border-b border-border/50 hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="p-6 border-t border-border flex items-center justify-between">
            <LanguageSwitcher />
            {!user && (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline-gold !py-2 !px-5 text-xs">
                Sign In
              </Link>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
