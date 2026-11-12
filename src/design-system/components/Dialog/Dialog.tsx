import { useEffect, useId, useRef, type ReactNode, type RefObject } from 'react';
import { X } from 'lucide-react';
import { cx } from '../../lib/cx';
import { useFocusTrap, useMediaQuery, usePresence, useScrollLock } from '../../lib/hooks';
import { Portal } from '../../lib/Portal';
import { IconButton } from '../IconButton/IconButton';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Footer actions, right-aligned on desktop, stacked full-width on mobile. Primary action last. */
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /**
   * `center` modal on ≥640px and a bottom sheet on phones (default),
   * or `left` drawer (used for mobile navigation).
   */
  placement?: 'center' | 'left';
  /** Element to focus on open (defaults to first focusable). */
  initialFocus?: RefObject<HTMLElement | null>;
  /** Prevent closing on overlay click (use for forms with unsaved input). */
  dismissOnOverlay?: boolean;
  hideClose?: boolean;
  /** Render children edge-to-edge with no header/footer chrome (title becomes screen-reader only). */
  bare?: boolean;
}

/**
 * Modal dialog. Portaled, focus-trapped, Esc to close, restores focus on close,
 * locks page scroll, labelled by its title and described by `description`.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  placement = 'center',
  initialFocus,
  dismissOnOverlay = true,
  hideClose,
  bare,
}: DialogProps) {
  const id = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const { mounted, state } = usePresence(open, 220);
  const isPhone = useMediaQuery('(max-width: 639px)');
  const asSheet = placement === 'center' && isPhone;

  useScrollLock(mounted);
  useFocusTrap(panelRef, open && mounted, initialFocus);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!mounted) return null;
  const shown = state === 'open';

  return (
    <Portal>
      <div className="fixed inset-0 z-50">
        <div
          aria-hidden="true"
          onClick={dismissOnOverlay ? onClose : undefined}
          className={cx(
            'absolute inset-0 bg-paper-inverse/40 backdrop-blur-[2px] transition-opacity duration-slow ease-out',
            shown ? 'opacity-100' : 'opacity-0',
          )}
        />
        <div
          className={cx(
            'pointer-events-none absolute inset-0 flex',
            placement === 'left' ? 'justify-start' : asSheet ? 'items-end' : 'items-center justify-center p-6',
          )}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${id}-title`}
            aria-describedby={description ? `${id}-desc` : undefined}
            tabIndex={-1}
            className={cx(
              'pointer-events-auto flex max-h-full flex-col bg-paper-raised shadow-lg outline-none',
              'transition-[opacity,transform] duration-slow ease-out',
              placement === 'left' && cx('h-full w-[min(20rem,88vw)] border-r border-line-default', shown ? 'translate-x-0' : '-translate-x-full'),
              asSheet && cx('max-h-[92dvh] w-full rounded-t-xl', shown ? 'translate-y-0' : 'translate-y-full'),
              placement === 'center' &&
                !asSheet &&
                cx(
                  'max-h-[min(44rem,calc(100dvh-3rem))] w-full rounded-lg border border-line-subtle',
                  size === 'sm' && 'max-w-md',
                  size === 'md' && 'max-w-xl',
                  size === 'lg' && 'max-w-3xl',
                  shown ? 'scale-100 opacity-100' : 'scale-[0.97] opacity-0',
                ),
            )}
          >
            {bare ? (
              <>
                <h2 id={`${id}-title`} className="sr-only">
                  {title}
                </h2>
                {children}
              </>
            ) : (
              <>
            {asSheet && <div aria-hidden="true" className="mx-auto mt-2 h-1 w-10 rounded-full bg-line-default" />}
            <header className="flex items-start gap-4 px-5 pt-5 pb-3 sm:px-6 sm:pt-6">
              <div className="min-w-0 flex-1">
                <h2 id={`${id}-title`} className="text-lg font-semibold tracking-tight text-ink-primary">
                  {title}
                </h2>
                {description && (
                  <p id={`${id}-desc`} className="mt-1 text-base text-ink-secondary">
                    {description}
                  </p>
                )}
              </div>
              {!hideClose && <IconButton aria-label="Close dialog" icon={<X />} size="sm" onClick={onClose} className="-mt-1 -mr-2" />}
            </header>
            {children && <div className="min-h-0 flex-1 overflow-y-auto px-5 py-2 sm:px-6">{children}</div>}
            {footer && (
              <footer className="flex flex-col-reverse gap-2 border-t border-line-subtle px-5 py-4 sm:flex-row sm:justify-end sm:px-6 [&>*]:max-sm:w-full">
                {footer}
              </footer>
            )}
              </>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
