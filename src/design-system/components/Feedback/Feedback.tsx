import type { ReactNode } from 'react';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import { cx } from '../../lib/cx';

/* ---------------------------------- Alert --------------------------------- */

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';
const alertTones: Record<AlertTone, { box: string; icon: typeof Info }> = {
  info: { box: 'bg-info-bg border-info-line text-info-fg', icon: Info },
  success: { box: 'bg-success-bg border-success-line text-success-fg', icon: CircleCheck },
  warning: { box: 'bg-warning-bg border-warning-line text-warning-fg', icon: TriangleAlert },
  danger: { box: 'bg-danger-bg border-danger-line text-danger-fg', icon: CircleAlert },
};

export interface AlertProps {
  tone?: AlertTone;
  title: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/** Inline, persistent message tied to a region of the page. */
export function Alert({ tone = 'info', title, children, action, className }: AlertProps) {
  const { box, icon: Icon } = alertTones[tone];
  return (
    <div role={tone === 'danger' ? 'alert' : 'note'} className={cx('flex items-start gap-3 rounded-md border px-4 py-3', box, className)}>
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-semibold">{title}</p>
        {children && <div className="mt-0.5 text-ink-secondary">{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ------------------------------- EmptyState ------------------------------- */

export interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  /** `quiet` for inside cards; `page` for whole-view empties. */
  variant?: 'quiet' | 'page';
  /** Render the title as a heading when the empty state IS the page (e.g. 404 → 'h1'). */
  titleAs?: 'p' | 'h1' | 'h2' | 'h3';
  className?: string;
}

/** What to show when there is nothing to show — always explain why and offer the next step. */
export function EmptyState({ icon, title, children, action, variant = 'quiet', titleAs: Title = 'p', className }: EmptyStateProps) {
  return (
    <div className={cx('flex flex-col items-center text-center', variant === 'page' ? 'px-6 py-20' : 'px-4 py-10', className)}>
      {icon && (
        <div
          aria-hidden="true"
          className="relative mb-4 flex size-12 items-center justify-center rounded-lg border border-line-default bg-paper-raised text-ink-secondary shadow-sm [&_svg]:size-5"
        >
          {icon}
          <span className="absolute -inset-2 -z-10 rounded-xl border border-dashed border-line-default" />
        </div>
      )}
      <Title className={cx('font-semibold tracking-tight text-ink-primary', variant === 'page' ? 'font-serif text-2xl font-normal' : 'text-md')}>{title}</Title>
      {children && <div className="mt-1.5 max-w-sm text-sm text-ink-tertiary">{children}</div>}
      {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  );
}

/* -------------------------------- Skeleton -------------------------------- */

/** Loading placeholder that mirrors the final layout's shape. Hidden from AT (pair with aria-busy on the region). */
export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        'block animate-shimmer rounded-sm bg-[length:200%_100%]',
        'bg-[linear-gradient(90deg,var(--color-paper-sunken)_25%,var(--color-line-subtle)_50%,var(--color-paper-sunken)_75%)]',
        className,
      )}
    />
  );
}

/* ----------------------------------- Kbd ---------------------------------- */

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-xs border border-line-default bg-paper-raised px-1 font-mono text-2xs text-ink-secondary shadow-xs">
      {children}
    </kbd>
  );
}

/* ------------------------------- ProgressBar ------------------------------ */

export interface ProgressBarProps {
  value: number;
  max?: number;
  label: string;
  /** Show "3 of 5" next to the bar. */
  showValue?: boolean;
  tone?: 'ink' | 'accent' | 'success';
  className?: string;
}

export function ProgressBar({ value, max = 100, label, showValue, tone = 'ink', className }: ProgressBarProps) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className={cx('flex items-center gap-3', className)}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-sunken"
      >
        <div
          className={cx(
            'h-full rounded-full transition-[width] duration-slow ease-out',
            tone === 'ink' && 'bg-paper-inverse',
            tone === 'accent' && 'bg-ember-400',
            tone === 'success' && 'bg-success-fg',
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showValue && (
        <span className="shrink-0 text-xs text-ink-tertiary tabular">
          {value} of {max}
        </span>
      )}
    </div>
  );
}
