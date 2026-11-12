import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { cx } from '../../lib/cx';

/**
 * Data table primitives built on native <table> semantics.
 * Wrap in <TableContainer> for horizontal scroll on narrow screens.
 * For phones, products should render a card list instead (see ProjectList).
 */
export function TableContainer({ children, className, label }: { children: ReactNode; className?: string; label: string }) {
  return (
    // tabIndex+role+label lets keyboard users scroll an overflowing table
    <div role="region" aria-label={label} tabIndex={0} className={cx('overflow-x-auto rounded-lg border border-line-default bg-paper-raised shadow-sm', className)}>
      {children}
    </div>
  );
}

export function Table({ className, ...rest }: HTMLAttributes<HTMLTableElement>) {
  return <table className={cx('w-full border-collapse text-left text-sm', className)} {...rest} />;
}

export function THead(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} className={cx('bg-paper-base', props.className)} />;
}

export function TBody(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} className={cx('divide-y divide-line-subtle', props.className)} />;
}

export interface TRowProps extends HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  interactive?: boolean;
}

export function TRow({ selected, interactive, className, ...rest }: TRowProps) {
  return (
    <tr
      aria-selected={selected || undefined}
      className={cx(
        'transition-colors duration-fast',
        interactive && 'cursor-pointer hover:bg-paper-base',
        selected && 'bg-ember-50',
        className,
      )}
      {...rest}
    />
  );
}

export type SortDirection = 'asc' | 'desc';

export interface THProps extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Makes the header a sort button and sets aria-sort. */
  sortable?: boolean;
  sorted?: SortDirection | false;
  onSort?: () => void;
  align?: 'left' | 'right';
}

export function TH({ sortable, sorted = false, onSort, align = 'left', className, children, ...rest }: THProps) {
  const ariaSort = sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : sortable ? 'none' : undefined;
  const Icon = sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ArrowUpDown;
  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      className={cx(
        'h-10 border-b border-line-default px-4 text-2xs font-semibold tracking-wider whitespace-nowrap text-ink-tertiary uppercase',
        align === 'right' && 'text-right',
        className,
      )}
      {...rest}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className={cx(
            'group -mx-1.5 inline-flex items-center gap-1 rounded-xs px-1.5 py-1 uppercase hover:text-ink-primary',
            sorted && 'text-ink-primary',
          )}
        >
          {children}
          <Icon aria-hidden="true" className={cx('size-3 transition-opacity', sorted ? 'opacity-100' : 'opacity-0 group-hover:opacity-60 group-focus-visible:opacity-60')} />
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export function TD({ className, align = 'left', ...rest }: TdHTMLAttributes<HTMLTableCellElement> & { align?: 'left' | 'right' }) {
  return <td className={cx('h-14 px-4 align-middle text-ink-primary', align === 'right' && 'text-right', className)} {...rest} />;
}
