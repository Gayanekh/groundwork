import { forwardRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { cx } from '../../lib/cx';
import { useField } from '../Field/Field';

/** Shared control surface. Exported so Select's trigger matches inputs exactly. */
export const controlStyles = cx(
  'w-full rounded-sm in-data-[surface=mist]:rounded-2xl border bg-paper-raised text-ink-primary shadow-xs in-data-[surface=mist]:shadow-none',
  'placeholder:text-ink-tertiary transition-[border-color,box-shadow] duration-fast ease-standard',
  // Core surface (landing, case study, app): white field, light 1px border, no shadow.
  'in-data-[surface=core]:border-line-default in-data-[surface=core]:bg-paper-base in-data-[surface=core]:shadow-none in-data-[surface=core]:hover:border-line-strong',
  'hover:border-ink-tertiary',
  'focus-visible:outline-none focus-visible:border-ember-600 focus-visible:ring-3 focus-visible:ring-ember-100 in-data-[surface=mist]:focus-visible:ring-4 in-data-[surface=mist]:focus-visible:ring-ember-100/70',
  'disabled:cursor-not-allowed disabled:bg-paper-sunken disabled:text-ink-disabled disabled:hover:border-line-default disabled:border-line-default',
  'aria-invalid:border-danger-fg aria-invalid:focus-visible:ring-danger-bg',
);

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md';
  /** Icon or text rendered inside the left edge (decorative). */
  leading?: ReactNode;
  /** Element rendered inside the right edge (e.g. clear button, unit). */
  trailing?: ReactNode;
  invalid?: boolean;
}

/** Text input. Inside a Field it picks up id, required, aria-describedby and aria-invalid. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = 'md', leading, trailing, invalid, className, id, required, ...rest },
  ref,
) {
  const field = useField();
  const isInvalid = invalid ?? field?.invalid ?? false;
  return (
    <div className={cx('relative flex items-center', className)}>
      {leading && (
        <span aria-hidden="true" className="pointer-events-none absolute left-3 flex text-ink-tertiary in-data-[surface=mist]:left-4.5 [&_svg]:size-4">
          {leading}
        </span>
      )}
      <input
        ref={ref}
        id={id ?? field?.id}
        required={required ?? field?.required}
        aria-invalid={isInvalid || undefined}
        aria-describedby={rest['aria-describedby'] ?? field?.describedBy}
        className={cx(
          controlStyles,
          // 16px text on touch avoids iOS zoom-on-focus
          size === 'sm' ? 'h-8 px-2.5 text-sm in-data-[surface=mist]:h-10 in-data-[surface=core]:h-10 in-data-[surface=core]:px-3 in-data-[surface=core]:text-base pointer-coarse:h-10 pointer-coarse:text-md' : 'in-data-[surface=core]:h-16 in-data-[surface=core]:px-4 in-data-[surface=core]:text-md h-10 px-3 text-base in-data-[surface=mist]:h-12 in-data-[surface=mist]:rounded-full in-data-[surface=mist]:px-5 pointer-coarse:h-11 pointer-coarse:text-md',
          leading ? 'pl-9 in-data-[surface=mist]:pl-12 in-data-[surface=core]:pl-10' : '',
          trailing ? 'pr-10' : '',
        )}
        {...rest}
      />
      {trailing && <span className="absolute right-1.5 flex items-center">{trailing}</span>}
    </div>
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, id, required, rows = 4, ...rest },
  ref,
) {
  const field = useField();
  const isInvalid = invalid ?? field?.invalid ?? false;
  return (
    <textarea
      ref={ref}
      id={id ?? field?.id}
      rows={rows}
      required={required ?? field?.required}
      aria-invalid={isInvalid || undefined}
      aria-describedby={rest['aria-describedby'] ?? field?.describedBy}
      className={cx(controlStyles, 'min-h-20 resize-y px-3 py-2.5 text-base leading-relaxed in-data-[surface=core]:min-h-40 in-data-[surface=core]:px-4 in-data-[surface=core]:py-4 in-data-[surface=core]:text-md pointer-coarse:text-md', className)}
      {...rest}
    />
  );
});
