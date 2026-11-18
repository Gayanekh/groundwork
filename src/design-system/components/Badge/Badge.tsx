import type { ReactNode } from 'react';
import { cx } from '../../lib/cx';

export type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'accent';

const tones: Record<Tone, { badge: string; dot: string }> = {
  neutral: { badge: 'bg-neutral-bg text-neutral-fg border-neutral-line', dot: 'bg-neutral-fg' },
  success: { badge: 'bg-success-bg text-success-fg border-success-line', dot: 'bg-success-fg' },
  warning: { badge: 'bg-warning-bg text-warning-fg border-warning-line', dot: 'bg-warning-fg' },
  danger: { badge: 'bg-danger-bg text-danger-fg border-danger-line', dot: 'bg-danger-fg' },
  info: { badge: 'bg-info-bg text-info-fg border-info-line', dot: 'bg-info-fg' },
  accent: { badge: 'bg-ember-50 text-ember-700 border-ember-100', dot: 'bg-ember-600' },
};

export interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  /** Leading status dot. Color is never the only signal: the label always carries meaning. */
  dot?: boolean;
  icon?: ReactNode;
  size?: 'sm' | 'md';
  /** `tag` is the compact, outlined app badge. `pill` is the softer marketing badge: fully rounded, borderless, roomier. */
  shape?: 'tag' | 'pill';
  className?: string;
}

/** Short status/metadata label. Not interactive. */
export function Badge({ children, tone = 'neutral', dot, icon, size = 'md', shape = 'tag', className }: BadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center font-medium whitespace-nowrap',
        shape === 'pill' ? 'gap-1.5 rounded-full border border-transparent [&_svg]:size-3.5' : 'gap-1.5 rounded-xs border in-data-[surface=mist]:rounded-full in-data-[surface=mist]:border-transparent [&_svg]:size-3',
        shape === 'pill' ? (size === 'sm' ? 'h-6 px-2.5 text-xs' : 'h-7 px-3 text-sm') : size === 'sm' ? 'h-5 px-1.5 text-2xs' : 'h-6 px-2 text-xs',
        tones[tone].badge,
        className,
      )}
    >
      {dot && <span aria-hidden="true" className={cx('size-1.5 rounded-full', tones[tone].dot)} />}
      {icon}
      {children}
    </span>
  );
}

/** Standalone status dot for dense layouts. Requires a label for assistive tech. */
export function StatusDot({ tone = 'neutral', label, pulse }: { tone?: Tone; label: string; pulse?: boolean }) {
  return (
    <span role="img" aria-label={label} className="relative inline-flex size-2 shrink-0">
      {pulse && <span aria-hidden="true" className={cx('absolute inset-0 animate-ping rounded-full opacity-40 motion-reduce:hidden', tones[tone].dot)} />}
      <span aria-hidden="true" className={cx('relative size-2 rounded-full', tones[tone].dot)} />
    </span>
  );
}
