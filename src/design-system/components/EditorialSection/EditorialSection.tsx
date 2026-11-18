import { useId, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { Reveal } from '../Reveal/Reveal';

export interface EditorialSectionProps {
  /** Anchor id. Also used by `ThreadRail` to track the active section. */
  id: string;
  /** Optional number shown after the label, e.g. "02". Leave it out unless the order matters to the reader. */
  index?: string;
  /** Short tag label, e.g. "The problem". Shown uppercase. */
  label: string;
  /** The section heading (rendered as h2). */
  title: ReactNode;
  /** Optional lead paragraph under the heading. */
  lede?: ReactNode;
  /** Where the heading sits: stacked left, centered, or split (tag left, heading right). */
  align?: 'left' | 'center' | 'split';
  /** `ink` makes a full-bleed dark band. */
  tone?: 'paper' | 'ink';
  /** Extra content in the header area, e.g. a button under the lede. */
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** Circle-dot tag with the section name, e.g. "PROBLEM". A number can follow, e.g. "PROBLEM / 01". */
export function SectionTag({ label, index, ink }: { label: string; index?: string; ink?: boolean }) {
  return (
    <p className={cx('inline-flex items-center gap-2.5 text-base uppercase', ink ? 'text-ink-inverse' : 'text-ink-primary')}>
      <span aria-hidden="true" className={cx('grid size-6 place-items-center rounded-full border', ink ? 'border-ink-inverse' : 'border-ink-primary')}>
        <span className={cx('size-2 rounded-full', ink ? 'bg-ink-inverse' : 'bg-ink-primary')} />
      </span>
      <span>{label}</span>
      {index && (
        <>
          <span className={ink ? 'text-ink-inverse-tertiary' : 'text-ink-tertiary'}>/</span>
          <span>{index}</span>
        </>
      )}
    </p>
  );
}

/**
 * Marketing section: a circle-dot tag, a large tight heading and an optional lede, then the content.
 * One h2 per section; the heading names the region. `tone="ink"` makes a full-bleed dark band.
 */
export function EditorialSection({ id, index, label, title, lede, align = 'left', tone = 'paper', actions, children, className }: EditorialSectionProps) {
  const headingId = useId();
  const ink = tone === 'ink';
  const heading = (
    <Reveal delay={0.1} y={30}>
      <h2 id={headingId} className={cx('text-3xl leading-[1] font-medium tracking-[-0.03em] text-balance sm:text-4xl md:text-heading', align === 'center' && 'mx-auto max-w-3xl text-center', align !== 'center' && 'max-w-3xl')}>
        {title}
      </h2>
    </Reveal>
  );
  const body = (
    <>
      {lede && (
        <Reveal delay={0.2} y={30}>
          <p className={cx('mt-6 max-w-xl text-md leading-snug md:text-lg', align === 'center' && 'mx-auto text-center', ink ? 'text-ink-inverse-secondary' : 'text-ink-secondary')}>{lede}</p>
        </Reveal>
      )}
      {actions && (
        <Reveal delay={0.3} y={30}>
          <div className={cx('mt-8 flex flex-wrap gap-3', align === 'center' && 'justify-center')}>{actions}</div>
        </Reveal>
      )}
    </>
  );
  return (
    <section id={id} aria-labelledby={headingId} className={cx('scroll-mt-16', ink && 'bg-paper-inverse text-ink-inverse', className)}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-10 sm:py-14 md:py-20">
        {align === 'split' ? (
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <SectionTag label={label} index={index} ink={ink} />
            </div>
            <div className="md:col-span-7">
              {heading}
              {body}
            </div>
          </div>
        ) : (
          <div className={align === 'center' ? 'text-center' : undefined}>
            <SectionTag label={label} index={index} ink={ink} />
            <div className="mt-8">{heading}</div>
            {body}
          </div>
        )}
        {children && <div className="mt-14 md:mt-16">{children}</div>}
      </div>
    </section>
  );
}
