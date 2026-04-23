import { ReactNode, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Premium full-screen panel transition (metajive-style).
 * Gold panel slides up from bottom (0.4s) covering screen,
 * then slides out upward revealing new page (0.4s).
 * Total: ~0.8s.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  const [render, setRender] = useState(children);
  const [phase, setPhase] = useState<'idle' | 'cover' | 'reveal'>('idle');
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      setRender(children);
      return;
    }
    // Cover phase: panel slides up from bottom
    setPhase('cover');
    const t1 = setTimeout(() => {
      // swap content while screen is covered
      setRender(children);
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      setPhase('reveal');
    }, 400);
    const t2 = setTimeout(() => setPhase('idle'), 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, navType]);

  // Keep latest children when no transition is running
  useEffect(() => {
    if (phase === 'idle') setRender(children);
  }, [children, phase]);

  // translateY values: cover: -100% -> 0; reveal: 0 -> -100%; idle: 100% (offscreen below)
  const translate =
    phase === 'cover' ? '0%' : phase === 'reveal' ? '-100%' : '100%';
  const transition =
    phase === 'idle'
      ? 'none'
      : 'transform 0.4s cubic-bezier(0.76, 0, 0.24, 1)';

  return (
    <>
      {render}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: '#e8c97e',
          transform: `translate3d(0, ${translate}, 0)`,
          transition,
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      />
    </>
  );
}
