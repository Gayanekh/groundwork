import { useId, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllableState } from '../../lib/hooks';

export interface SwitchProps {
  label: ReactNode;
  description?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

/** On/off setting that applies immediately (no Save button). For form choices use Checkbox. */
export function Switch({ label, description, checked, defaultChecked = false, onChange, disabled, className }: SwitchProps) {
  const id = useId();
  const [on, setOn] = useControllableState(checked, defaultChecked, onChange);
  return (
    <div className={cx('flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        <label htmlFor={id} className={cx('text-base font-medium', disabled ? 'text-ink-disabled' : 'text-ink-primary')}>
          {label}
        </label>
        {description && (
          <p id={`${id}-d`} className="mt-0.5 text-sm text-ink-tertiary">
            {description}
          </p>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={on}
        aria-describedby={description ? `${id}-d` : undefined}
        disabled={disabled}
        onClick={() => setOn(!on)}
        className={cx(
          'relative mt-0.5 inline-flex h-6 w-10 shrink-0 items-center rounded-full border transition-colors duration-base ease-standard',
          'pointer-coarse:h-7 pointer-coarse:w-12',
          on ? 'border-paper-inverse bg-paper-inverse' : 'border-line-strong bg-paper-sunken',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        <span
          aria-hidden="true"
          className={cx(
            'absolute left-0.5 size-[18px] rounded-full bg-white shadow-sm transition-transform duration-base ease-out pointer-coarse:size-[22px]',
            on ? 'translate-x-4 pointer-coarse:translate-x-5' : 'translate-x-0',
          )}
        />
      </button>
    </div>
  );
}
