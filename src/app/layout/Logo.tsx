import { cx } from '@/design-system';

/** Groundwork mark: a horizon line with a rising path — "the ground is ready". Original asset. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cx('size-7', className)}>
      <rect width="32" height="32" rx="8" className="fill-paper-inverse" />
      <path d="M8 21h16" className="stroke-ink-inverse" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M8 21l4-8 4 5 3-3 5 6" fill="none" className="stroke-ember-400" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cx('flex items-center gap-2', className)}>
      <LogoMark />
      <span className="text-[17px] font-semibold tracking-[-0.02em] text-ink-primary">Groundwork</span>
    </span>
  );
}
