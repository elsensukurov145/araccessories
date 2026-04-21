import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/** 300ms fade + y translate on every route change. transform/opacity only. */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [stage, setStage] = useState<'in' | 'out'>('in');
  const [render, setRender] = useState(children);

  useEffect(() => {
    setStage('out');
    const t = setTimeout(() => {
      setRender(children);
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      setStage('in');
    }, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Update children reference when not transitioning
  useEffect(() => {
    if (stage === 'in') setRender(children);
  }, [children, stage]);

  return (
    <div
      style={{
        opacity: stage === 'in' ? 1 : 0,
        transform: stage === 'in' ? 'translateY(0)' : 'translateY(-10px)',
        transition: 'opacity 300ms cubic-bezier(0.23,1,0.32,1), transform 300ms cubic-bezier(0.23,1,0.32,1)',
      }}
    >
      {render}
    </div>
  );
}
