import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cx } from '../../lib/cx';
import { useControllableState, useFloating, useOutsidePointer, usePresence } from '../../lib/hooks';
import { Portal } from '../../lib/Portal';
import { useField } from '../Field/Field';
import { controlStyles } from '../Input/Input';

export interface SelectOption<V extends string = string> {
  value: V;
  label: string;
  /** Secondary line or trailing meta (e.g. a count). */
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SelectProps<V extends string = string> {
  options: ReadonlyArray<SelectOption<V>>;
  value?: V;
  defaultValue?: V;
  onChange?: (value: V) => void;
  placeholder?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
  invalid?: boolean;
  /** Required when not inside a Field. */
  'aria-label'?: string;
  id?: string;
  className?: string;
  /** Renders a prefix inside the trigger, e.g. "Stage:" for filter bars. */
  prefix?: string;
}

/**
 * Single-select listbox (WAI-ARIA "select-only combobox" pattern).
 * Keyboard: ↑/↓ move, Home/End jump, Enter/Space select, Esc close, type-ahead by first letters.
 * Built from scratch; the listbox is portaled so it is never clipped by overflow containers.
 */
export function Select<V extends string = string>({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select…',
  size = 'md',
  disabled,
  invalid,
  id,
  className,
  prefix,
  ...aria
}: SelectProps<V>) {
  const field = useField();
  const autoId = useId();
  const triggerId = id ?? field?.id ?? autoId;
  const listId = `${triggerId}-listbox`;
  const [selected, setSelected] = useControllableState<V | undefined>(value, defaultValue, onChange as (v: V | undefined) => void);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeahead = useRef({ text: '', at: 0 });
  const { mounted, state } = usePresence(open, 120);
  const floatingStyle = useFloating(triggerRef, listRef, mounted, { placement: 'bottom-start', matchWidth: true });

  const current = options.find((o) => o.value === selected);
  const enabledIndexes = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);

  useOutsidePointer([triggerRef, listRef], () => setOpen(false), open);

  useEffect(() => {
    if (open) {
      const idx = options.findIndex((o) => o.value === selected);
      setActive(idx >= 0 ? idx : (enabledIndexes[0] ?? -1));
    }
    // only when opening
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open || active < 0) return;
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  const commit = (index: number) => {
    const opt = options[index];
    if (!opt || opt.disabled) return;
    setSelected(opt.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const move = (dir: 1 | -1) => {
    if (enabledIndexes.length === 0) return;
    const pos = enabledIndexes.indexOf(active);
    const next = pos === -1 ? enabledIndexes[0] : enabledIndexes[Math.min(Math.max(pos + dir, 0), enabledIndexes.length - 1)];
    setActive(next);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (disabled) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open) setOpen(true);
        else move(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!open) setOpen(true);
        else move(-1);
        break;
      case 'Home':
        if (open) {
          e.preventDefault();
          setActive(enabledIndexes[0]);
        }
        break;
      case 'End':
        if (open) {
          e.preventDefault();
          setActive(enabledIndexes[enabledIndexes.length - 1]);
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (open) commit(active);
        else setOpen(true);
        break;
      case 'Escape':
        if (open) {
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
        }
        break;
      case 'Tab':
        if (open) setOpen(false);
        break;
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const now = Date.now();
          const t = typeahead.current;
          t.text = now - t.at > 600 ? e.key.toLowerCase() : t.text + e.key.toLowerCase();
          t.at = now;
          const match = options.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(t.text));
          if (match >= 0) {
            if (open) setActive(match);
            else setSelected(options[match].value);
          }
        }
    }
  };

  const isInvalid = invalid ?? field?.invalid ?? false;

  return (
    <>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        aria-invalid={isInvalid || undefined}
        aria-describedby={field?.describedBy}
        aria-label={aria['aria-label']}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        className={cx(
          controlStyles,
          'flex items-center gap-2 text-left',
          size === 'sm' ? 'h-8 pl-2.5 pr-2 text-sm pointer-coarse:h-10' : 'h-10 pl-3 pr-2.5 text-base pointer-coarse:h-11',
          open && 'border-ember-600 ring-3 ring-ember-100',
          className,
        )}
      >
        {prefix && <span className="shrink-0 text-ink-tertiary">{prefix}</span>}
        {current?.icon && <span className="flex shrink-0 [&_svg]:size-4">{current.icon}</span>}
        <span className={cx('min-w-0 flex-1 truncate', !current && 'text-ink-tertiary')}>{current?.label ?? placeholder}</span>
        <ChevronDown
          aria-hidden="true"
          className={cx('size-4 shrink-0 text-ink-tertiary transition-transform duration-base ease-standard', open && 'rotate-180')}
        />
      </button>
      {mounted && (
        <Portal>
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-labelledby={triggerId}
            tabIndex={-1}
            style={floatingStyle}
            data-state={state}
            className={cx(
              'z-40 max-h-80 overflow-auto rounded-md border border-line-default bg-paper-raised p-1 shadow-md',
              'transition-[opacity,transform] duration-fast ease-out',
              state === 'open' ? 'opacity-100' : 'opacity-0 -translate-y-1',
            )}
          >
            {options.map((opt, i) => {
              const isSelected = opt.value === selected;
              return (
                <li
                  key={opt.value}
                  id={`${listId}-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={opt.disabled || undefined}
                  onPointerMove={() => !opt.disabled && setActive(i)}
                  onClick={() => commit(i)}
                  className={cx(
                    'flex cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm text-ink-primary pointer-coarse:py-3',
                    i === active && 'bg-paper-sunken',
                    opt.disabled && 'cursor-not-allowed text-ink-disabled',
                  )}
                >
                  {opt.icon && <span className="flex shrink-0 text-ink-secondary [&_svg]:size-4">{opt.icon}</span>}
                  <span className="min-w-0 flex-1 truncate">{opt.label}</span>
                  {opt.description && <span className="shrink-0 text-xs text-ink-tertiary tabular">{opt.description}</span>}
                  <Check aria-hidden="true" className={cx('size-4 shrink-0 text-ember-600', !isSelected && 'invisible')} />
                </li>
              );
            })}
          </ul>
        </Portal>
      )}
    </>
  );
}
