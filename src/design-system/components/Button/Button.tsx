import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { Spinner } from '../Spinner/Spinner';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-medium ' +
  'transition-[background-color,border-color,color,box-shadow,transform] duration-fast ease-standard ' +
  'active:translate-y-px disabled:pointer-events-none disabled:active:translate-y-0 aria-busy:cursor-progress';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-paper-inverse text-ink-inverse shadow-xs hover:bg-paper-inverse-hover disabled:bg-paper-sunken disabled:text-ink-disabled disabled:shadow-none',
  accent:
    'bg-ember-600 text-white shadow-xs hover:bg-ember-700 disabled:bg-paper-sunken disabled:text-ink-disabled disabled:shadow-none',
  secondary:
    'bg-paper-raised text-ink-primary border border-line-default shadow-xs hover:border-line-strong hover:bg-paper-base disabled:text-ink-disabled disabled:bg-paper-base disabled:shadow-none',
  ghost: 'text-ink-secondary hover:bg-paper-sunken hover:text-ink-primary disabled:text-ink-disabled',
  danger:
    'bg-danger-solid text-white shadow-xs hover:bg-danger-solid-hover disabled:bg-paper-sunken disabled:text-ink-disabled disabled:shadow-none',
};

// pointer-coarse: bumps height to a 44px touch target on touch devices.
const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 rounded-sm px-3 text-sm pointer-coarse:h-10 [&_svg]:size-3.5',
  md: 'h-9 rounded-md px-3.5 text-base pointer-coarse:h-11 [&_svg]:size-4',
  lg: 'h-11 rounded-md px-5 text-md [&_svg]:size-[18px]',
};

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

/** Class string for button visuals. Use on `<a>` / router links that must look like buttons. */
export function buttonStyles({ variant = 'secondary', size = 'md', fullWidth }: ButtonStyleOptions = {}) {
  return cx(base, variants[variant], sizes[size], fullWidth && 'w-full');
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleOptions {
  /** Shows a spinner, sets aria-busy and blocks clicks. Label stays for screen readers. */
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

/**
 * The single action primitive.
 * - One `primary` (or `accent`) button per view region; everything else is secondary/ghost.
 * - `danger` only for destructive, irreversible actions, ideally inside a confirm Dialog.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'md', fullWidth, loading = false, leadingIcon, trailingIcon, disabled, className, children, type = 'button', onClick, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={loading ? (e) => e.preventDefault() : onClick}
      className={cx(buttonStyles({ variant, size, fullWidth }), className)}
      {...rest}
    >
      {loading ? <Spinner size={size === 'lg' ? 18 : 14} /> : leadingIcon}
      <span className="truncate">{children}</span>
      {!loading && trailingIcon}
    </button>
  );
});
