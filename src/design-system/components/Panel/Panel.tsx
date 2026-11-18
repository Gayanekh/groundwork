import type { HTMLAttributes } from 'react';
import { cx } from '../../lib/cx';
import { Atmosphere } from '../Atmosphere/Atmosphere';

export interface PanelProps extends HTMLAttributes<HTMLElement> {
  /** `light` white card, `dark` near-black with a faint grid, `wash` the sky-to-coral gradient. */
  tone?: 'light' | 'dark' | 'wash';
  /** Element to render. Use `section` when the panel has a heading. */
  as?: 'div' | 'section' | 'article' | 'li';
  /** Inner padding. `none` for full-bleed media. */
  padding?: 'none' | 'md' | 'lg';
  /** Corner radius: 24px or 32px. */
  radius?: '2xl' | '3xl';
  /** No outline, with a large soft shadow, for a panel that floats over a gradient. Light tone only. */
  elevated?: boolean;
}

const grid =
  'linear-gradient(var(--color-line-inverse) 1px, transparent 1px), linear-gradient(90deg, var(--color-line-inverse) 1px, transparent 1px)';

/**
 * Large rounded marketing surface. Light panels sit on the page base, dark panels carry a faint
 * grid, wash panels show the Atmosphere gradient. Content is layered above the decoration.
 */
export function Panel({ tone = 'light', as: As = 'div', padding = 'md', radius = '3xl', elevated, className, children, ...rest }: PanelProps) {
  return (
    <As
      className={cx(
        'relative isolate overflow-hidden',
        radius === '3xl' ? 'rounded-3xl' : 'rounded-2xl',
        tone === 'light' && (elevated ? 'bg-paper-raised shadow-lg' : 'border border-line-subtle bg-paper-raised'),
        tone === 'dark' && 'border border-line-inverse bg-paper-inverse text-ink-inverse',
        tone === 'wash' && 'border border-line-subtle bg-paper-sunken',
        padding === 'md' && 'p-5 sm:p-8',
        padding === 'lg' && 'p-6 sm:p-10 lg:p-12',
        className,
      )}
      {...rest}
    >
      {tone === 'dark' && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-70"
          style={{
            backgroundImage: grid,
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(ellipse at 30% 40%, black, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 30% 40%, black, transparent 78%)',
          }}
        />
      )}
      {tone === 'wash' && <Atmosphere className="absolute inset-0 -z-10" parallax={false} fade={false} />}
      {children}
    </As>
  );
}
