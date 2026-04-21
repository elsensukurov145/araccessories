import { useEffect, useRef } from 'react';

/**
 * Lightweight cursor: 6px white dot (instant) + 32px hollow ring (lerped).
 * Single rAF loop, transform: translate3d only.
 * Pauses when tab hidden. Disabled on touch / reduced-motion.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let rx = tx, ry = ty;
    let raf = 0;
    let visible = true;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = () => {
      // Dot snaps instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
      }
      // Ring lerps
      rx += (tx - rx) * 0.12;
      ry += (ty - ry) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      const nowVisible = document.visibilityState === 'visible';
      if (nowVisible && !visible) {
        visible = true;
        raf = requestAnimationFrame(tick);
      } else if (!nowVisible && visible) {
        visible = false;
        cancelAnimationFrame(raf);
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="hidden md:block"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: '9999px',
          border: '1.5px solid rgba(232,201,126,0.75)',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
        }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="hidden md:block"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: '9999px',
          background: '#ffffff',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
        }}
      />
    </>
  );
}
