import { ReactNode, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Simple fade page transition.
 * Old page fades out (opacity 1 -> 0) in 150ms, then new page fades in (0 -> 1) in 200ms.
 * No overlay, no blocking element, no color panel.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [render, setRender] = useState(children);
  const [opacity, setOpacity] = useState(1);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      setRender(children);
      return;
    }
    setOpacity(0);
    const t1 = setTimeout(() => {
      setRender(children);
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      // next frame, fade in
      requestAnimationFrame(() => setOpacity(1));
    }, 150);
    return () => clearTimeout(t1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Keep latest children when fully visible
  useEffect(() => {
    if (opacity === 1) setRender(children);
  }, [children, opacity]);

  return (
    <div
      style={{
        opacity,
        transition: opacity === 0 ? 'opacity 150ms ease-out' : 'opacity 200ms ease-in',
        willChange: 'opacity',
      }}
    >
      {render}
    </div>
  );
}
