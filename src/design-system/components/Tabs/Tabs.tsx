import { createContext, useContext, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllableState } from '../../lib/hooks';

interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
  baseId: string;
}
const TabsContext = createContext<TabsContextValue | null>(null);
const useTabs = () => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs.* must be used inside <Tabs>');
  return ctx;
};

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

/**
 * Tabs (WAI-ARIA tabs pattern, automatic activation).
 * ←/→ move between tabs, Home/End jump. Roving tabindex: only the active tab is in the Tab order.
 */
export function Tabs({ value, defaultValue = '', onChange, children, className }: TabsProps) {
  const [current, setCurrent] = useControllableState(value, defaultValue, onChange);
  const baseId = useId();
  return (
    <TabsContext.Provider value={{ value: current, setValue: setCurrent, baseId }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabList({ children, label, className }: { children: ReactNode; label: string; className?: string }) {
  const { value } = useTabs();
  const listRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  // Animated active indicator: measured from the selected tab.
  useLayoutEffect(() => {
    const list = listRef.current;
    const tab = list?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
    if (!list || !tab) return;
    const measure = () => setIndicator({ left: tab.offsetLeft, width: tab.offsetWidth });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [value]);

  const onKeyDown = (e: KeyboardEvent) => {
    const tabs = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])') ?? []);
    const i = tabs.indexOf(document.activeElement as HTMLElement);
    let next = -1;
    if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    if (next >= 0) {
      e.preventDefault();
      tabs[next].focus();
      tabs[next].click();
    }
  };

  return (
    <div className={cx('relative overflow-x-auto [scrollbar-width:none]', className)}>
      <div ref={listRef} role="tablist" aria-label={label} onKeyDown={onKeyDown} className="relative flex min-w-max gap-1 border-b border-line-default">
        {children}
        {indicator && (
          <span
            aria-hidden="true"
            className="absolute bottom-[-1px] h-0.5 rounded-full bg-ink-primary transition-[left,width] duration-base ease-out"
            style={{ left: indicator.left, width: indicator.width }}
          />
        )}
      </div>
    </div>
  );
}

export function Tab({ value, children, count, disabled }: { value: string; children: ReactNode; count?: number; disabled?: boolean }) {
  const ctx = useTabs();
  const selected = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${ctx.baseId}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${ctx.baseId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      onClick={() => ctx.setValue(value)}
      className={cx(
        'relative -mb-px flex h-10 items-center gap-2 rounded-t-sm px-3 text-base font-medium whitespace-nowrap transition-colors duration-fast pointer-coarse:h-12',
        selected ? 'text-ink-primary' : 'text-ink-tertiary hover:text-ink-primary',
        'disabled:text-ink-disabled',
      )}
    >
      {children}
      {count !== undefined && (
        <span
          className={cx(
            'min-w-5 rounded-full px-1.5 text-center text-xs tabular leading-5',
            selected ? 'bg-paper-inverse text-ink-inverse' : 'bg-paper-sunken text-ink-secondary',
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export function TabPanel({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  const ctx = useTabs();
  if (ctx.value !== value) return null;
  return (
    <div
      role="tabpanel"
      id={`${ctx.baseId}-panel-${value}`}
      aria-labelledby={`${ctx.baseId}-tab-${value}`}
      tabIndex={0}
      className={cx('animate-fade-in focus-visible:outline-offset-4', className)}
    >
      {children}
    </div>
  );
}
