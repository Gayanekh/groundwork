import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../lib/cx';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Required: icon-only controls must have an accessible name. */
  'aria-label': string;
  icon: ReactNode;
  variant?: 'ghost' | 'secondary';
  size?: 'sm' | 'md';
}

/** Square icon-only button. Pair with Tooltip to show the label on hover/focus. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, variant = 'ghost', size = 'md', className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(
        'inline-flex shrink-0 items-center justify-center rounded-md text-ink-secondary transition-colors duration-fast ease-standard',
        'hover:text-ink-primary active:translate-y-px disabled:pointer-events-none disabled:text-ink-disabled',
        'aria-expanded:bg-paper-sunken aria-expanded:text-ink-primary',
        variant === 'ghost' && 'hover:bg-paper-sunken',
        variant === 'secondary' && 'border border-line-default bg-paper-raised shadow-xs hover:border-line-strong',
        size === 'sm' ? 'size-8 pointer-coarse:size-10 [&_svg]:size-4' : 'size-9 pointer-coarse:size-11 [&_svg]:size-[18px]',
        className,
      )}
      {...rest}
    >
      {icon}
    </button>
  );
});
