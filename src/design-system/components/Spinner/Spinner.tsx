import { cx } from '../../lib/cx';

export interface SpinnerProps {
  /** Pixel size. Defaults to 16 (matches md icon size). */
  size?: number;
  /** Accessible label. Omit when the spinner is decorative (e.g. inside a busy button). */
  label?: string;
  className?: string;
}

/** Indeterminate progress indicator. Inherits text color. */
export function Spinner({ size = 16, label, className }: SpinnerProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cx('animate-spin shrink-0', className)}
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
