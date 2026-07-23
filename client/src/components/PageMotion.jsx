import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Fade/slide-in for children. Marks with data-motion="brand|title|body|form|decor".
 * @param {{ children: React.ReactNode, className?: string, replayKey?: string | number }} props
 */
export function PageMotion({ children, className = '', replayKey }) {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) {
        return;
      }

      const brand = root.querySelectorAll('[data-motion="brand"]');
      const title = root.querySelectorAll('[data-motion="title"]');
      const body = root.querySelectorAll('[data-motion="body"]');
      const form = root.querySelectorAll('[data-motion="form"]');
      const decor = root.querySelectorAll('[data-motion="decor"]');

      if (prefersReducedMotion()) {
        gsap.set([brand, title, body, form, decor], {
          clearProps: 'all',
          opacity: 1,
          y: 0,
          scale: 1,
        });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      if (decor.length) {
        gsap.set(decor, { opacity: 0, scale: 0.92 });
        tl.to(decor, { opacity: 1, scale: 1, duration: 0.7, stagger: 0.08 }, 0);
      }
      if (brand.length) {
        gsap.set(brand, { opacity: 0, y: 16 });
        tl.to(brand, { opacity: 1, y: 0, duration: 0.55 }, 0.05);
      }
      if (title.length) {
        gsap.set(title, { opacity: 0, y: 18 });
        tl.to(title, { opacity: 1, y: 0, duration: 0.5 }, 0.18);
      }
      if (body.length) {
        gsap.set(body, { opacity: 0, y: 14 });
        tl.to(body, { opacity: 1, y: 0, duration: 0.45 }, 0.28);
      }
      if (form.length) {
        gsap.set(form, { opacity: 0, y: 20 });
        tl.to(form, { opacity: 1, y: 0, duration: 0.5 }, 0.38);
      }
    },
    { scope: rootRef, dependencies: [replayKey] },
  );

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
