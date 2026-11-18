import type { MouseEvent } from 'react';
import { animate } from 'motion/react';
import { EASE_OUT } from '@/design-system';

type Stop = () => void;
let stopCurrent: Stop | null = null;

/**
 * Glide to a section on an eased curve instead of snapping, then update the address and move focus
 * to the section so keyboard and screen-reader users land there too. Scrolling by hand cancels the
 * glide. With reduced motion the page jumps straight to the section.
 */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  stopCurrent?.();

  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  const target = Math.max(0, el.getBoundingClientRect().top + window.scrollY - margin);
  const distance = Math.abs(target - window.scrollY);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce || distance < 2) {
    window.scrollTo(0, target);
  } else {
    const controls = animate(window.scrollY, target, {
      duration: Math.min(1.3, 0.55 + distance / 3500),
      ease: EASE_OUT,
      onUpdate: (y) => window.scrollTo(0, y),
    });
    const cancel = () => {
      controls.stop();
      cleanup();
    };
    const cleanup = () => {
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      window.removeEventListener('keydown', cancel);
      stopCurrent = null;
    };
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchstart', cancel, { passive: true });
    window.addEventListener('keydown', cancel);
    controls.then(cleanup);
    stopCurrent = cancel;
  }

  window.history.replaceState(null, '', `#${id}`);
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

/** onClick for an in-page link: keep modified clicks (new tab) native, glide otherwise. */
export function jumpTo(id: string) {
  return (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    scrollToId(id);
  };
}
