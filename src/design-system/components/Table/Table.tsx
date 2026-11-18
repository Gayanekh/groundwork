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
    <div role="region" aria-label={label} tabIndex={0} className={cx('overflow-x-auto rounded-lg border border-line-default bg-paper-raised shadow-sm in-data-[surface=mist]:rounded-none in-data-[surface=mist]:border-0 in-data-[surface=mist]:overflow-visible in-data-[surface=mist]:bg-transparent in-data-[surface=mist]:shadow-none', className)}>
      {children}
    </div>
  );
}

export function Table({ className, ...rest }: HTMLAttributes<HTMLTableElement>) {
  return <table className={cx('w-full border-collapse text-left text-sm in-data-[surface=mist]:border-separate in-data-[surface=mist]:border-spacing-0', className)} {...rest} />;
}

export function THead(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} className={cx('bg-paper-base in-data-[surface=mist]:bg-transparent', props.className)} />;
}

export function TBody(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} className={cx('divide-y divide-line-subtle in-data-[surface=mist]:divide-y-0', props.className)} />;
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
        interactive && 'cursor-pointer hover:bg-paper-base in-data-[surface=mist]:hover:bg-transparent in-data-[surface=mist]:hover:[&>td]:border-transparent in-data-[surface=mist]:hover:[&>td]:bg-paper-raised in-data-[surface=mist]:hover:[&>td:first-child]:rounded-l-2xl in-data-[surface=mist]:hover:[&>td:last-child]:rounded-r-2xl',
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
        'h-10 border-b border-line-default px-4 text-2xs font-semibold tracking-wider whitespace-nowrap text-ink-tertiary uppercase in-data-[surface=mist]:sticky in-data-[surface=mist]:top-16 in-data-[surface=mist]:z-10 in-data-[surface=mist]:h-12 in-data-[surface=mist]:border-line-default in-data-[surface=mist]:bg-paper-base/85 in-data-[surface=mist]:px-5 in-data-[surface=mist]:backdrop-blur-md in-data-[surface=mist]:text-sm in-data-[surface=mist]:font-normal in-data-[surface=mist]:tracking-normal in-data-[surface=mist]:normal-case',
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
            'group -mx-1.5 inline-flex items-center gap-1 rounded-xs px-1.5 py-1 uppercase hover:text-ink-primary in-data-[surface=mist]:rounded-full in-data-[surface=mist]:normal-case',
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
  return <td className={cx('h-14 px-4 align-middle text-ink-primary in-data-[surface=mist]:h-[4.5rem] in-data-[surface=mist]:border-b in-data-[surface=mist]:border-line-subtle in-data-[surface=mist]:px-5 transition-colors duration-fast', align === 'right' && 'text-right', className)} {...rest} />;
}
