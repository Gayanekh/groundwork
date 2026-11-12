import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';
import { cx } from '../../lib/cx';
import { Portal } from '../../lib/Portal';

export type ToastTone = 'success' | 'info' | 'danger';

export interface ToastOptions {
  title: string;
  description?: string;
  tone?: ToastTone;
  /** Optional single action, e.g. Undo. Closes the toast when clicked. */
  action?: { label: string; onClick: () => void };
  /** ms before auto-dismiss. Paused while hovered or focused. Default 5000. */
  duration?: number;
}

interface ToastItem extends Required<Pick<ToastOptions, 'title' | 'tone' | 'duration'>>, Omit<ToastOptions, 'title' | 'tone' | 'duration'> {
  id: number;
}

const ToastContext = createContext<((t: ToastOptions) => void) | null>(null);

/** Show a toast. Must be inside <ToastProvider>. */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

const icons = { success: CircleCheck, info: Info, danger: CircleAlert };
// The light *-line tokens read well on the dark toast surface.
const iconTone = { success: 'text-success-line', info: 'text-info-line', danger: 'text-danger-line' };

/**
 * Feedback after an action. Announced politely via an aria-live region.
 * Use for confirmations ("Update sent"), not for errors that block a form (use Field errors).
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setItems((all) => all.filter((t) => t.id !== id)), []);
  const push = useCallback((t: ToastOptions) => {
    const id = nextId.current++;
    setItems((all) => [...all.slice(-2), { tone: 'success', duration: 5000, ...t, id }]);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <Portal>
        <ol
          aria-live="polite"
          aria-label="Notifications"
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 sm:right-0 sm:left-auto sm:items-end sm:p-6"
        >
          {items.map((t) => (
            <ToastView key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </ol>
      </Portal>
    </ToastContext.Provider>
  );
}

function ToastView({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const [paused, setPaused] = useState(false);
  const Icon = icons[item.tone];
  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(onDismiss, item.duration);
    return () => window.clearTimeout(t);
  }, [paused, item.duration, onDismiss]);

  return (
    <li
      role={item.tone === 'danger' ? 'alert' : 'status'}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-lg bg-paper-inverse py-3 pr-2 pl-4 text-ink-inverse shadow-lg"
    >
      <Icon aria-hidden="true" className={cx('mt-0.5 size-4 shrink-0', iconTone[item.tone])} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{item.title}</p>
        {item.description && <p className="mt-0.5 text-sm text-ink-inverse/75">{item.description}</p>}
      </div>
      {item.action && (
        <button
          type="button"
          onClick={() => {
            item.action?.onClick();
            onDismiss();
          }}
          className="h-7 shrink-0 rounded-sm px-2 text-sm font-semibold text-ember-100 hover:bg-white/10 focus-visible:outline-ember-100"
        >
          {item.action.label}
        </button>
      )}
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={onDismiss}
        className="flex size-7 shrink-0 items-center justify-center rounded-sm text-ink-inverse/60 hover:bg-white/10 hover:text-ink-inverse focus-visible:outline-ember-100"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </li>
  );
}
