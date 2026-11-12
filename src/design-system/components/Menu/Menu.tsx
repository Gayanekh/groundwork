import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../lib/cx';
import { useFloating, useOutsidePointer, usePresence, type Placement } from '../../lib/hooks';
import { Portal } from '../../lib/Portal';

interface MenuContextValue {
  close: () => void;
}
const MenuContext = createContext<MenuContextValue | null>(null);

export interface MenuProps {
  /** A single focusable element (Button / IconButton). Receives aria-haspopup/expanded/controls. */
  trigger: ReactElement<Record<string, unknown>>;
  children: ReactNode;
  placement?: Placement;
  /** Accessible name of the menu, if the trigger's label isn't enough. */
  label?: string;
}

/**
 * Action menu (WAI-ARIA menu button pattern).
 * Keyboard: Enter/Space/↓ on trigger opens and focuses first item; ↑/↓/Home/End move;
 * Esc closes and returns focus to the trigger; Tab closes.
 */
export function Menu({ trigger, children, placement = 'bottom-end', label }: MenuProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const triggerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { mounted, state } = usePresence(open, 120);
  const style = useFloating(triggerRef, menuRef, mounted, { placement });
  const focusFirst = useRef<'first' | 'last'>('first');

  useOutsidePointer([triggerRef as React.RefObject<HTMLElement>, menuRef], () => setOpen(false), open);

  const items = () => Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])') ?? []);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      const list = items();
      (focusFirst.current === 'first' ? list[0] : list[list.length - 1])?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const onMenuKey = (e: KeyboardEvent) => {
    const list = items();
    const i = list.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      list[(i + 1) % list.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      list[(i - 1 + list.length) % list.length]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      list[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      list[list.length - 1]?.focus();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      close();
    } else if (e.key === 'Tab') {
      close(false);
    }
  };

  const triggerEl = cloneElement(trigger, {
    ref: triggerRef,
    id: `${id}-trigger`,
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': open ? `${id}-menu` : undefined,
    onClick: () => {
      focusFirst.current = 'first';
      setOpen((o) => !o);
    },
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        focusFirst.current = e.key === 'ArrowDown' ? 'first' : 'last';
        setOpen(true);
      }
    },
  });

  return (
    <>
      {triggerEl}
      {mounted && (
        <Portal>
          <MenuContext.Provider value={{ close: () => close() }}>
            <div
              ref={menuRef}
              id={`${id}-menu`}
              role="menu"
              aria-labelledby={label ? undefined : `${id}-trigger`}
              aria-label={label}
              style={style}
              onKeyDown={onMenuKey}
              className={cx(
                'z-40 min-w-52 rounded-md border border-line-default bg-paper-raised p-1 shadow-md',
                'transition-[opacity,transform] duration-fast ease-out',
                state === 'open' ? 'opacity-100' : 'opacity-0 -translate-y-1',
              )}
            >
              {children}
            </div>
          </MenuContext.Provider>
        </Portal>
      )}
    </>
  );
}

export interface MenuItemProps {
  children: ReactNode;
  onSelect?: () => void;
  icon?: ReactNode;
  /** Right-aligned hint, e.g. a keyboard shortcut. */
  hint?: ReactNode;
  tone?: 'default' | 'danger';
  disabled?: boolean;
}

export function MenuItem({ children, onSelect, icon, hint, tone = 'default', disabled }: MenuItemProps) {
  const ctx = useContext(MenuContext);
  const select = () => {
    if (disabled) return;
    ctx?.close();
    onSelect?.();
  };
  return (
    <div
      role="menuitem"
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      onClick={select}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          select();
        }
      }}
      className={cx(
        'flex cursor-pointer select-none items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm outline-none pointer-coarse:py-3',
        'focus:bg-paper-sunken hover:bg-paper-sunken [&_svg]:size-4 [&_svg]:shrink-0',
        tone === 'danger' ? 'text-danger-fg' : 'text-ink-primary [&_svg]:text-ink-secondary',
        disabled && 'cursor-not-allowed text-ink-disabled hover:bg-transparent [&_svg]:text-ink-disabled',
      )}
    >
      {icon}
      <span className="flex-1">{children}</span>
      {hint && <span className="text-xs text-ink-tertiary">{hint}</span>}
    </div>
  );
}

export function MenuSeparator() {
  return <div role="separator" className="-mx-1 my-1 h-px bg-line-subtle" />;
}

export function MenuLabel({ children }: { children: ReactNode }) {
  return <div className="px-2.5 pt-2 pb-1 text-2xs font-semibold uppercase tracking-wider text-ink-tertiary">{children}</div>;
}

