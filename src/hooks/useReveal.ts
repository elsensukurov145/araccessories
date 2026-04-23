import { useEffect, useRef } from 'react';

/**
 * Adds `is-revealed` class to the element (and optionally its children with
 * `[data-reveal-child]`) when it scrolls into view. Animates only once.
 *
 * Usage:
 *   const ref = useReveal<HTMLDivElement>();
 *   <div ref={ref} className="reveal">...</div>
 *   // children with stagger:
 *   <div data-reveal-child style={{ '--reveal-delay': '0.06s' }}>...</div>
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-revealed');
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          target.classList.add('is-revealed');
          // stagger children
          const children = target.querySelectorAll<HTMLElement>('[data-reveal-child]');
          children.forEach((child, i) => {
            child.style.setProperty('--reveal-delay', `${i * 0.06}s`);
            child.classList.add('is-revealed');
          });
          io.unobserve(target);
        }
      });
    }, options);
    io.observe(el);
    return () => io.disconnect();
  }, [options]);

  return ref;
}
