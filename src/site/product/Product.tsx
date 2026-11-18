import { useId, useRef, useState } from 'react';
import { useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { Atmosphere, SectionTag, cx, useMediaQuery } from '@/design-system';
import { DEVON, MARIA_BLOCKED, PRIYA, TOM, type QueueRow } from './shared';
import { QueueCard } from './TodayScreen';

interface Step {
  short: string;
  title: string;
  body: string;
  rows: QueueRow[];
}

const MARIA_OK: QueueRow = { ...MARIA_BLOCKED, health: 'on-track', reason: 'Letter received · ready to advance' };
const MARIA_DONE: QueueRow = { ...MARIA_BLOCKED, stage: 'Installation', health: 'on-track', reason: 'Update sent (simulated)' };

const STEPS: Step[] = [
  { short: 'Open', title: 'Open Today.', body: 'Maria’s permit is blocked and five days past its target, so she is first. Each row says why.', rows: [MARIA_BLOCKED, DEVON, PRIYA, TOM] },
  { short: 'Resolve', title: 'Resolve the blocker.', body: 'The engineer’s letter arrives. The coordinator resolves the blocker with a note, and Maria drops down the list.', rows: [DEVON, MARIA_OK, PRIYA, TOM] },
  { short: 'Advance', title: 'Advance and tell her.', body: 'The checklist is done, the project moves to Installation, and Maria gets a plain-language update. Sending is simulated.', rows: [DEVON, PRIYA, TOM, MARIA_DONE] },
];

function Demo() {
  const reduce = useReducedMotion();
  const wide = useMediaQuery('(min-width: 48rem)');
  const pinned = wide && !reduce;
  const track = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (pinned) setStep(p < 0.34 ? 0 : p < 0.67 ? 1 : 2);
  });

  return (
    <div ref={track} className={pinned ? 'h-[230vh]' : undefined}>
      <div className={cx('grid items-center gap-8 lg:grid-cols-12 lg:gap-10', pinned && 'sticky top-20')}>
        {/* On phones the steps come first, as big labelled buttons, then the phone they change. */}
        <div className="order-1 lg:order-2 lg:col-span-5 lg:col-start-8">
          <ol aria-label="Steps" className="grid grid-cols-3 gap-2 lg:hidden">
            {STEPS.map((s, n) => (
              <li key={s.short}>
                <button
                  type="button"
                  aria-label={`Show step ${n + 1}: ${s.title}`}
                  aria-current={n === step ? 'step' : undefined}
                  onClick={() => setStep(n)}
                  className={cx(
                    'flex min-h-12 w-full items-center justify-center gap-2 rounded-full border px-2 text-sm font-medium transition-colors duration-fast ease-standard',
                    n === step ? 'border-ink-primary bg-paper-inverse text-ink-inverse' : 'border-line-default bg-paper-raised/80 text-ink-primary',
                  )}
                >
                  <span className="font-mono text-xs opacity-70">{n + 1}</span>
                  {s.short}
                </button>
              </li>
            ))}
          </ol>
          <div className="flex gap-6">
            <ol aria-label="Steps, side" className="hidden flex-col items-center gap-3 pt-1 lg:flex">
              {STEPS.map((s, n) => (
                <li key={s.title}>
                  <button type="button" aria-label={`Show step ${n + 1} of ${STEPS.length}: ${s.title}`} aria-current={n === step ? 'step' : undefined} onClick={() => setStep(n)} className="grid size-8 place-items-center rounded-full">
                    <span className={cx('rounded-full transition-[transform,background-color] duration-base ease-out', n === step ? 'size-3 bg-ink-primary' : 'size-2.5 bg-line-strong hover:bg-ink-secondary')} />
                  </button>
                </li>
              ))}
            </ol>
            <div aria-live="polite" className="mt-6 lg:mt-0">
              <p className="font-mono text-sm text-ink-tertiary">[05-{step + 1}]</p>
              <h3 className="mt-2 font-display text-2xl leading-tight font-normal tracking-[-0.014em]">{STEPS[step].title}</h3>
              <p className="mt-3 max-w-sm text-base text-ink-secondary">{STEPS[step].body}</p>
              {pinned && <p className="mt-6 text-xs text-ink-tertiary">Keep scrolling, or pick a step.</p>}
            </div>
          </div>
        </div>
        <div className="order-2 flex justify-center lg:order-1 lg:col-span-6">
          <QueueCard rows={STEPS[step].rows} animate={!reduce} />
        </div>
      </div>
    </div>
  );
}

export function Product() {
  const headingId = useId();
  return (
    <section id="product" aria-labelledby={headingId} className="scroll-mt-16 px-2 sm:px-3">
      <div className="relative isolate overflow-clip rounded-3xl bg-paper-base md:rounded-[5rem]">
        <Atmosphere from="bottom" parallax={false} className="absolute inset-0 -z-10" />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-10 sm:py-14 md:py-20">
          <SectionTag label="Product" />
          <h2 id={headingId} className="mt-8 max-w-2xl text-3xl leading-[1] font-medium tracking-[-0.03em] text-balance sm:text-4xl md:text-heading">
            Every project, clear and within easy reach.
          </h2>
          <div className="mt-10 md:mt-16">
            <Demo />
          </div>
        </div>
      </div>
    </section>
  );
}
