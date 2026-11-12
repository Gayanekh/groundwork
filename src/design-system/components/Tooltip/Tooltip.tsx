import { cloneElement, useEffect, useId, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useFloating, type Placement } from '../../lib/hooks';
import { Portal } from '../../lib/Portal';

export interface TooltipProps {
  content: ReactNode;
  /** One focusable child. Gets aria-describedby while the tooltip is visible. */
  children: ReactElement<Record<string, unknown>>;
  placement?: Placement;
  /** Hover delay in ms (focus shows immediately). */
  delay?: number;
}

/**
 * Supplementary label on hover and keyboard focus. Esc dismisses (WCAG 1.4.13).
 * Never put essential information or interactive content in a tooltip.
 */
export function Tooltip({ content, children, placement = 'top', delay = 350 }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const style = useFloating(anchorRef, tipRef, open, { placement, offset: 8 });

  const show = (immediate = false) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), immediate ? 0 : delay);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && hide();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const child = cloneElement(children, {
    ref: anchorRef,
    'aria-describedby': open ? id : undefined,
    onPointerEnter: () => show(),
    onPointerLeave: hide,
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      if (e.target.matches(':focus-visible')) show(true);
    },
    onBlur: hide,
  });

  return (
    <>
      {child}
      {open && (
        <Portal>
          <div
            ref={tipRef}
            id={id}
            role="tooltip"
            style={style}
            className={cx(
              'pointer-events-none z-50 max-w-64 rounded-sm bg-paper-inverse px-2.5 py-1.5 text-xs font-medium text-ink-inverse shadow-md',
              'animate-fade-in',
            )}
          >
            {content}
          </div>
        </Portal>
      )}
    </>
  );
}
