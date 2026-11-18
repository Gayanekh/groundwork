import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { Spinner } from '../Spinner/Spinner';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-medium ' +
  'transition-[background-color,border-color,color,box-shadow,transform] duration-fast ease-standard ' +
  'active:translate-y-px disabled:pointer-events-none disabled:active:translate-y-0 aria-busy:cursor-progress ' +
  // Soft marketing feel: a small lift on hover, and a trailing arrow nudges forward.
  'in-data-[surface=mist]:hover:-translate-y-px in-data-[surface=mist]:disabled:hover:translate-y-0 [&_svg]:transition-transform [&_svg]:duration-base [&_svg]:ease-out in-data-[surface=mist]:hover:[&>svg:last-child:not(:first-child)]:translate-x-0.5 ' +
  // Core surface (landing page): regular weight, 300ms color fade, no hover lift.
  'in-data-[surface=core]:font-normal in-data-[surface=core]:tracking-[0.01em] in-data-[surface=core]:duration-300';

const variants: Record<ButtonVariant, string> = {
  primary:
    'in-data-[surface=core]:border in-data-[surface=core]:border-core-ink in-data-[surface=core]:shadow-none in-data-[surface=core]:hover:bg-transparent in-data-[surface=core]:hover:text-core-ink in-data-[surface=core]:disabled:border-line-default in-data-[surface=mist]:shadow-[inset_0_1px_0_rgb(255_255_255/0.16),0_1px_2px_rgb(28_27_25/0.25)] in-data-[surface=mist]:hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_8px_20px_-6px_rgb(28_27_25/0.4)] bg-paper-inverse text-ink-inverse shadow-xs hover:bg-paper-inverse-hover disabled:bg-paper-sunken disabled:text-ink-disabled disabled:shadow-none',
  accent:
    'bg-ember-600 text-white shadow-xs hover:bg-ember-700 disabled:bg-paper-sunken disabled:text-ink-disabled disabled:shadow-none',
  secondary:
    'in-data-[surface=core]:border-core-ink in-data-[surface=core]:bg-transparent in-data-[surface=core]:shadow-none in-data-[surface=core]:hover:border-core-ink in-data-[surface=core]:hover:bg-core-card in-data-[surface=core]:disabled:border-line-default in-data-[surface=mist]:hover:shadow-float bg-paper-raised text-ink-primary border border-line-default shadow-xs hover:border-line-strong hover:bg-paper-base disabled:text-ink-disabled disabled:bg-paper-base disabled:shadow-none',
  ghost: 'text-ink-secondary hover:bg-paper-sunken hover:text-ink-primary disabled:text-ink-disabled',
  danger:
    'bg-danger-solid text-white shadow-xs hover:bg-danger-solid-hover disabled:bg-paper-sunken disabled:text-ink-disabled disabled:shadow-none',
};

// pointer-coarse: bumps height to a 44px touch target on touch devices.
const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 rounded-sm in-data-[surface=mist]:rounded-full px-3 text-sm pointer-coarse:h-10 [&_svg]:size-3.5',
  md: 'in-data-[surface=core]:h-10 in-data-[surface=core]:px-6 h-9 rounded-md in-data-[surface=mist]:rounded-full px-3.5 text-base pointer-coarse:h-11 [&_svg]:size-4',
  lg: 'in-data-[surface=core]:h-10 in-data-[surface=core]:px-6 in-data-[surface=core]:text-base h-11 rounded-md in-data-[surface=mist]:rounded-full px-5 text-md [&_svg]:size-[18px]',
};

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** Marketing feel: pressing scales the button to 97% instead of nudging it down 1px. */
  press?: boolean;
  /** Fully rounded marketing button. */
  pill?: boolean;
}

/** Class string for button visuals. Use on `<a>` / router links that must look like buttons. */
export function buttonStyles({ variant = 'secondary', size = 'md', fullWidth, press, pill }: ButtonStyleOptions = {}) {
  const shape = pill ? sizes[size].replace(/rounded-(sm|md)/, 'rounded-full') : sizes[size];
  return cx(base, variants[variant], shape, fullWidth && 'w-full', press && 'active:translate-y-0 active:scale-[0.97]', pill && variant === 'primary' && 'bg-linear-to-b from-paper-inverse-hover to-paper-inverse');
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
  { variant = 'secondary', size = 'md', fullWidth, press, pill, loading = false, leadingIcon, trailingIcon, disabled, className, children, type = 'button', onClick, ...rest },
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
      className={cx(buttonStyles({ variant, size, fullWidth, press, pill }), className)}
      {...rest}
    >
      {loading ? <Spinner size={size === 'lg' ? 18 : 14} /> : leadingIcon}
      <span className="truncate">{children}</span>
      {!loading && trailingIcon}
    </button>
  );
});
