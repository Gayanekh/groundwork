import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllableState } from '../../lib/hooks';

export interface SegmentOption<V extends string> {
  value: V;
  label: ReactNode;
  /** Optional count rendered after the label. */
  count?: number;
}

export interface SegmentedControlProps<V extends string> {
  options: ReadonlyArray<SegmentOption<V>>;
  value?: V;
  defaultValue?: V;
  onChange?: (value: V) => void;
  /** Accessible name of the group. */
  label: string;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Mutually exclusive filter/view switch (radiogroup semantics; ←/→ move and select).
 * Use for 2–5 short options that change what is shown on the same page.
 */
export function SegmentedControl<V extends string>({ options, value, defaultValue, onChange, label, size = 'md', className }: SegmentedControlProps<V>) {
  const [current, setCurrent] = useControllableState<V>(value, defaultValue ?? options[0].value, onChange);
  const ref = useRef<HTMLDivElement>(null);
  const name = useId();

  const onKeyDown = (e: KeyboardEvent) => {
    const i = options.findIndex((o) => o.value === current);
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % options.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + options.length) % options.length;
    if (next < 0) return;
    e.preventDefault();
    setCurrent(options[next].value);
    ref.current?.querySelectorAll<HTMLElement>('[role="radio"]')[next]?.focus();
  };

  return (
    <div
      ref={ref}
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cx('inline-flex max-w-full overflow-x-auto rounded-md border border-line-default bg-paper-sunken p-0.5 [scrollbar-width:none]', className)}
    >
      {options.map((o) => {
        const selected = o.value === current;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            name={name}
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => setCurrent(o.value)}
            className={cx(
              'inline-flex items-center gap-1.5 rounded-sm font-medium whitespace-nowrap transition-[background-color,color,box-shadow] duration-fast ease-standard',
              size === 'sm' ? 'h-7 px-2.5 text-sm pointer-coarse:h-9' : 'h-8 px-3 text-sm pointer-coarse:h-10',
              selected ? 'bg-paper-raised text-ink-primary shadow-sm' : 'text-ink-secondary hover:text-ink-primary',
            )}
          >
            {o.label}
            {o.count !== undefined && <span className={cx('text-xs tabular', selected ? 'text-ink-secondary' : 'text-ink-tertiary')}>{o.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
