import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/** Fade-up transition on every route change. CSS-only, GPU-accelerated. */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [key, setKey] = useState(pathname);

  useEffect(() => {
    setKey(pathname);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return (
    <div key={key} className="animate-fade-up">
      {children}
    </div>
  );
}
