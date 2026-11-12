import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';

/** Controlled/uncontrolled state in one hook (value + onChange, or defaultValue). */
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
): [T, (next: T) => void] {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const set = useCallback(
    (next: T) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );
  return [current, set];
}

/** Call `handler` on pointerdown outside every given element. */
export function useOutsidePointer(
  refs: Array<RefObject<HTMLElement | null>>,
  handler: () => void,
  enabled: boolean,
) {
  const handlerRef = useRef(handler);
  useLayoutEffect(() => {
    handlerRef.current = handler;
  });
  useEffect(() => {
    if (!enabled) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (refs.some((r) => r.current?.contains(target))) return;
      handlerRef.current();
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
    // refs are stable ref objects
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}

export type Placement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'top' | 'bottom';

/**
 * Minimal floating-element positioning (no Popper/Floating UI dependency).
 * Positions `floating` with `position: fixed` relative to `anchor`, flips vertically
 * when there is not enough room, and shifts horizontally to stay inside the viewport.
 */
export function useFloating(
  anchor: RefObject<HTMLElement | null>,
  floating: RefObject<HTMLElement | null>,
  open: boolean,
  { placement = 'bottom-start', offset = 6, matchWidth = false }: { placement?: Placement; offset?: number; matchWidth?: boolean } = {},
) {
  const [style, setStyle] = useState<React.CSSProperties>({ position: 'fixed', top: 0, left: 0, visibility: 'hidden' });

  const update = useCallback(() => {
    const a = anchor.current;
    const f = floating.current;
    if (!a || !f) return;
    const ar = a.getBoundingClientRect();
    const fr = f.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 8;
    const width = matchWidth ? Math.max(ar.width, fr.width) : fr.width;

    let side: 'top' | 'bottom' = placement.startsWith('top') ? 'top' : 'bottom';
    const spaceBelow = vh - ar.bottom;
    const spaceAbove = ar.top;
    if (side === 'bottom' && spaceBelow < fr.height + offset + margin && spaceAbove > spaceBelow) side = 'top';
    if (side === 'top' && spaceAbove < fr.height + offset + margin && spaceBelow > spaceAbove) side = 'bottom';

    let left: number;
    if (placement.endsWith('end')) left = ar.right - width;
    else if (placement === 'top' || placement === 'bottom') left = ar.left + ar.width / 2 - width / 2;
    else left = ar.left;
    left = Math.min(Math.max(margin, left), vw - width - margin);

    const top = side === 'bottom' ? ar.bottom + offset : ar.top - fr.height - offset;
    setStyle({
      position: 'fixed',
      top: Math.max(margin, top),
      left,
      minWidth: matchWidth ? ar.width : undefined,
      visibility: 'visible',
      // used by CSS to pick the entrance direction
      ['--gw-origin' as string]: side === 'bottom' ? 'top' : 'bottom',
    });
  }, [anchor, floating, placement, offset, matchWidth]);

  useLayoutEffect(() => {
    if (!open) return;
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, update]);

  return style;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function getFocusable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('inert') && el.getAttribute('aria-hidden') !== 'true',
  );
}

/**
 * Trap Tab focus inside `container` while active and restore focus to the
 * previously focused element on deactivate.
 */
export function useFocusTrap(container: RefObject<HTMLElement | null>, active: boolean, initialFocus?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!active) return;
    const root = container.current;
    if (!root) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const first = initialFocus?.current ?? getFocusable(root)[0] ?? root;
    first.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const items = getFocusable(root);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    root.addEventListener('keydown', onKey);
    return () => {
      root.removeEventListener('keydown', onKey);
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [active, container, initialFocus]);
}

/** Keep a component mounted during its exit animation. */
export function usePresence(open: boolean, durationMs = 180) {
  const [mounted, setMounted] = useState(open);
  const [state, setState] = useState<'open' | 'closed'>(open ? 'open' : 'closed');
  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() => setState('open'));
      return () => cancelAnimationFrame(id);
    }
    setState('closed');
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const t = window.setTimeout(() => setMounted(false), reduce ? 0 : durationMs);
    return () => window.clearTimeout(t);
  }, [open, durationMs]);
  return { mounted, state };
}

/** Lock body scroll while a modal surface is open. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [active]);
}

/** Subscribe to a media query. */
export function useMediaQuery(query: string): boolean {
  const get = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false);
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    if (!window.matchMedia) return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}
