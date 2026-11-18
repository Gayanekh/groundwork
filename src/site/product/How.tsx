import { useId, useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { ArrowRight, CircleCheck, Inbox, Send } from 'lucide-react';
import { SectionTag, buttonStyles, cx } from '@/design-system';
import { Link } from '@/app/router';

const STEPS: Array<{ icon: ReactNode; title: string; body: string }> = [
  { icon: <Inbox />, title: 'Triage', body: 'Open Today. A ranked list shows which projects need you, and why.' },
  { icon: <CircleCheck />, title: 'Resolve', body: 'Record what is in the way, resolve it with a note, and undo if you change your mind.' },
  { icon: <Send />, title: 'Advance and tell them', body: 'Finish the checklist, move to the next stage, and send a plain-language update in the same step.' },
];

/**
 * One step card. Each card sticks a little lower than the one before it, so as you scroll the next
 * card slides up and lands on top of the last. The card underneath eases back a little.
 */
function StepCard({ i, total, progress, step }: { i: number; total: number; progress: MotionValue<number>; step: (typeof STEPS)[number] }) {
  const reduce = useReducedMotion();
  const last = i === total - 1;
  const scale = useTransform(progress, last ? [0, 1] : [i / total, (i + 1) / total], last || reduce ? [1, 1] : [1, 0.94]);
  return (
    <li className="sticky" style={{ top: `calc(6.5rem + ${i * 1.1}rem)`, zIndex: i + 1 }}>
      <motion.div
        style={{ scale, transformOrigin: 'top center' }}
        className={cx('flex min-h-64 flex-col justify-between gap-8 rounded-3xl border border-line-subtle bg-paper-raised p-6 shadow-md sm:min-h-72 sm:p-8')}
      >
        <div className="flex items-start justify-between">
          <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-paper-base text-ink-primary [&_svg]:size-5">
            {step.icon}
          </span>
          <span aria-hidden="true" className="text-sm font-medium text-ink-tertiary">
            /0{i + 1}
          </span>
        </div>
        <div>
          <h3 className="text-3xl font-medium tracking-tight">{step.title}</h3>
          <p className="mt-3 max-w-md text-md text-ink-secondary">{step.body}</p>
        </div>
      </motion.div>
    </li>
  );
}

export function How() {
  const headingId = useId();
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 35%', 'end 75%'] });
  return (
    <section id="how" aria-labelledby={headingId} className="scroll-mt-16">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-10 sm:py-14 md:py-20 lg:grid-cols-2 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionTag label="How it works" />
          <h2 id={headingId} className="mt-8 max-w-md text-3xl leading-[1] font-medium tracking-[-0.03em] text-balance sm:text-4xl md:text-heading">
            Get clear in three simple steps
          </h2>
          <p className="mt-6 max-w-sm text-md leading-snug text-ink-secondary">One coordinator, one morning, one stalled permit. Here is the journey, from the first look to the update Maria reads.</p>
          <Link to="/app" className={`${buttonStyles({ variant: 'primary', size: 'lg', pill: true, press: true })} mt-10`}>
            Try the journey <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <ol ref={list} className="relative space-y-6 pb-16 lg:pb-40">
          {STEPS.map((s, i) => (
            <StepCard key={s.title} i={i} total={STEPS.length} progress={scrollYProgress} step={s} />
          ))}
        </ol>
      </div>
    </section>
  );
}
