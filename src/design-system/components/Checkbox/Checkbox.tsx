import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cx } from '../../lib/cx';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label: ReactNode;
  description?: ReactNode;
  /** Strike through the label when checked (checklists). */
  strikeWhenChecked?: boolean;
}

/**
 * Native checkbox (keeps all browser/AT behavior) with a custom visual.
 * The whole row is the click target.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, strikeWhenChecked, className, id, disabled, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <label
      htmlFor={inputId}
      className={cx(
        'group flex cursor-pointer items-start gap-3 rounded-md py-1.5 pointer-coarse:py-2.5',
        disabled && 'cursor-not-allowed',
        className,
      )}
    >
      <span className="relative mt-0.5 flex size-[18px] shrink-0">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          disabled={disabled}
          aria-describedby={description ? `${inputId}-d` : undefined}
          className={cx(
            'peer size-[18px] cursor-pointer appearance-none rounded-xs border border-line-strong bg-paper-raised transition-colors duration-fast',
            'checked:border-paper-inverse checked:bg-paper-inverse group-hover:border-ink-tertiary checked:group-hover:border-paper-inverse',
            'disabled:cursor-not-allowed disabled:bg-paper-sunken disabled:border-line-default',
          )}
          {...rest}
        />
        <Check
          aria-hidden="true"
          strokeWidth={3}
          className="pointer-events-none absolute inset-0 m-auto size-3 scale-50 text-ink-inverse opacity-0 transition-[opacity,transform] duration-fast ease-out peer-checked:scale-100 peer-checked:opacity-100"
        />
      </span>
      <span className="min-w-0">
        <span
          className={cx(
            'block text-base text-ink-primary transition-colors duration-fast',
            strikeWhenChecked && 'group-has-[:checked]:text-ink-tertiary group-has-[:checked]:line-through',
            disabled && 'text-ink-disabled',
          )}
        >
          {label}
        </span>
        {description && (
          <span id={`${inputId}-d`} className="mt-0.5 block text-sm text-ink-tertiary">
            {description}
          </span>
        )}
      </span>
    </label>
  );
});
