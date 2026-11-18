import type { ReactNode } from 'react';
import { cx } from '../../lib/cx';

export interface SpecimenFrameProps {
  /** Mono label above the frame, e.g. "Specimen 02 · Project health". */
  label: string;
  /** Caption below the frame. Say what the viewer is looking at. */
  caption?: ReactNode;
  /** Surface the frame sits on, so the label and caption stay readable. */
  on?: 'paper' | 'ink';
  /** Let the frame run off one edge of the layout, like a cropped magazine photograph. */
  bleed?: 'none' | 'right' | 'left';
  children: ReactNode;
  className?: string;
}

/**
 * Oversized frame for showing real UI like editorial photography. The content is live
 * design-system components, not a screenshot. The frame is always a light surface.
 */
export function SpecimenFrame({ label, caption, on = 'paper', bleed = 'none', children, className }: SpecimenFrameProps) {
  const ink = on === 'ink';
  return (
    <figure className={cx('min-w-0', className)}>
      <p className={cx('mb-3 font-mono text-2xs uppercase tracking-[0.08em]', ink ? 'text-ink-inverse-tertiary' : 'text-ink-tertiary')}>{label}</p>
      <div
        className={cx(
          'border bg-paper-raised p-4 shadow-lg sm:p-8',
          ink ? 'border-line-inverse-strong' : 'border-line-default',
          bleed === 'none' && 'rounded-xl',
          bleed === 'right' && 'rounded-l-xl border-r-0 sm:-mr-8 lg:-mr-24',
          bleed === 'left' && 'rounded-r-xl border-l-0 sm:-ml-8 lg:-ml-24',
        )}
      >
        {children}
      </div>
      {caption && <figcaption className={cx('mt-3 max-w-prose text-xs', ink ? 'text-ink-inverse-tertiary' : 'text-ink-tertiary')}>{caption}</figcaption>}
    </figure>
  );
}
