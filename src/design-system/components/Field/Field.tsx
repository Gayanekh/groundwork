import { createContext, useContext, useId, type ReactNode } from 'react';
import { CircleAlert } from 'lucide-react';
import { cx } from '../../lib/cx';

interface FieldContextValue {
  id: string;
  describedBy?: string;
  invalid: boolean;
  required: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

/** Read by Input/Textarea/Select to wire id, aria-describedby, aria-invalid automatically. */
export function useField() {
  return useContext(FieldContext);
}

export interface FieldProps {
  label: ReactNode;
  /** Helper text shown under the control. Replaced by `error` when present. */
  hint?: ReactNode;
  /** Error message. Sets aria-invalid on the control and is announced via aria-describedby. */
  error?: ReactNode;
  required?: boolean;
  /**
   * Show an "Optional" tag. Explicit, because many non-required controls (a select with a
   * default, a toggle) are not meaningfully "optional" to the user.
   */
  optional?: boolean;
  /** Visually hide the label (it stays available to assistive tech). */
  hideLabel?: boolean;
  /** Optional element aligned to the label row's right (e.g. a character counter). */
  aside?: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * Wraps one form control with label, hint and error.
 * Never place an Input without a Field (or an explicit aria-label).
 */
export function Field({ label, hint, error, required = false, optional = false, hideLabel, aside, className, children }: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <FieldContext.Provider value={{ id, describedBy, invalid: Boolean(error), required }}>
      <div className={cx('flex flex-col gap-1.5', className)}>
        <div className={cx('flex items-baseline justify-between gap-3', hideLabel && 'sr-only')}>
          <label htmlFor={id} className="text-sm font-medium text-ink-primary">
            {label}
            {required && (
              <span className="ml-0.5 text-ember-600" aria-hidden="true">
                *
              </span>
            )}
            {!required && optional && <span className="ml-1.5 text-xs font-normal text-ink-tertiary">Optional</span>}
          </label>
          {aside}
        </div>
        {children}
        {error ? (
          <p id={errorId} className="flex items-start gap-1.5 text-sm text-danger-fg animate-fade-in">
            <CircleAlert aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : hint ? (
          <p id={hintId} className="text-sm text-ink-tertiary">
            {hint}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}
