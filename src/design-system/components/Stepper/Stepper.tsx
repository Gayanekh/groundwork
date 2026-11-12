import type { ReactNode } from 'react';
import { Check, OctagonAlert } from 'lucide-react';
import { cx } from '../../lib/cx';

export type StepStatus = 'complete' | 'current' | 'blocked' | 'upcoming';

export interface Step {
  id: string;
  label: string;
  /** Short secondary line, e.g. a date or "4 days". */
  meta?: ReactNode;
  status: StepStatus;
}

export interface StepperProps {
  steps: ReadonlyArray<Step>;
  /** Accessible name, e.g. "Project stages". */
  label: string;
  /** `full` shows labels for every step; `compact` shows only dots (for table rows). */
  variant?: 'full' | 'compact';
  className?: string;
}

const statusText: Record<StepStatus, string> = {
  complete: 'complete',
  current: 'current stage',
  blocked: 'current stage, blocked',
  upcoming: 'not started',
};

/**
 * Linear progress through ordered stages. An ordered list, so screen readers announce
 * "3 of 7". Horizontal on wide containers; vertical below 640px in `full` mode.
 */
export function Stepper({ steps, label, variant = 'full', className }: StepperProps) {
  if (variant === 'compact') {
    return (
      <ol aria-label={label} className={cx('flex items-center gap-1', className)}>
        {steps.map((s) => (
          <li key={s.id} className="flex">
            <span className="sr-only">
              {s.label}: {statusText[s.status]}
            </span>
            <span
              aria-hidden="true"
              className={cx(
                'h-1.5 w-3 rounded-full',
                s.status === 'complete' && 'bg-ink-secondary',
                s.status === 'current' && 'w-5 bg-ember-600',
                s.status === 'blocked' && 'w-5 bg-danger-solid',
                s.status === 'upcoming' && 'bg-line-default',
              )}
            />
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol aria-label={label} className={cx('grid gap-0 max-sm:grid-cols-1 sm:grid-flow-col sm:auto-cols-fr', className)}>
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        const active = s.status === 'current' || s.status === 'blocked';
        return (
          <li
            key={s.id}
            aria-current={active ? 'step' : undefined}
            className="relative flex gap-3 max-sm:pb-5 max-sm:last:pb-0 sm:flex-col sm:gap-2.5 sm:pr-3"
          >
            {/* connector */}
            {!last && (
              <span
                aria-hidden="true"
                className={cx(
                  'absolute max-sm:top-6 max-sm:bottom-0 max-sm:left-[11px] max-sm:w-0.5 sm:top-[11px] sm:right-0 sm:left-7 sm:h-0.5',
                  s.status === 'complete' ? 'bg-ink-secondary' : 'bg-line-default',
                )}
              />
            )}
            <span
              aria-hidden="true"
              className={cx(
                'relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-2xs font-semibold tabular',
                s.status === 'complete' && 'border-ink-secondary bg-ink-secondary text-ink-inverse',
                s.status === 'current' && 'border-ember-600 bg-paper-raised text-ember-700 ring-4 ring-ember-50',
                s.status === 'blocked' && 'border-danger-solid bg-danger-solid text-white ring-4 ring-danger-bg',
                s.status === 'upcoming' && 'border-line-default bg-paper-raised text-ink-tertiary',
              )}
            >
              {s.status === 'complete' ? <Check className="size-3.5" strokeWidth={3} /> : s.status === 'blocked' ? <OctagonAlert className="size-3.5" /> : i + 1}
            </span>
            <span className="min-w-0 max-sm:pt-0.5">
              <span
                className={cx(
                  'block text-sm leading-tight font-medium',
                  active ? 'text-ink-primary' : s.status === 'complete' ? 'text-ink-secondary' : 'text-ink-tertiary',
                )}
              >
                {s.label}
                <span className="sr-only">, {statusText[s.status]}</span>
              </span>
              {s.meta && <span className={cx('mt-0.5 block text-xs tabular', s.status === 'blocked' ? 'text-danger-fg' : 'text-ink-tertiary')}>{s.meta}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
