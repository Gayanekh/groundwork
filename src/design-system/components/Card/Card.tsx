import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '../../lib/cx';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** `section` when the card has a heading (default), `div` for purely visual grouping. */
  as?: 'section' | 'div' | 'article' | 'li';
  padding?: 'none' | 'sm' | 'md';
  /** Adds hover elevation; use only when the whole card is a link/button target. */
  interactive?: boolean;
}

/** Raised surface for grouping related content. */
export function Card({ as: As = 'section', padding = 'md', interactive, className, children, ...rest }: CardProps) {
  return (
    <As
      className={cx(
        'rounded-lg border border-line-default bg-paper-raised shadow-sm',
        padding === 'sm' && 'p-4',
        padding === 'md' && 'p-5 sm:p-6',
        interactive && 'transition-[border-color,box-shadow] duration-fast ease-standard hover:border-line-strong hover:shadow-md',
        className,
      )}
      {...rest}
    >
      {children}
    </As>
  );
}

export interface CardHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  /** Right-aligned actions (buttons, menus). */
  actions?: ReactNode;
  /** Heading level for document outline. Defaults to h2. */
  level?: 2 | 3;
  className?: string;
}

export function CardHeader({ title, description, actions, level = 2, className }: CardHeaderProps) {
  const H = level === 2 ? 'h2' : 'h3';
  return (
    <div className={cx('mb-4 flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        <H className="text-md font-semibold tracking-tight text-ink-primary">{title}</H>
        {description && <p className="mt-0.5 text-sm text-ink-tertiary">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
