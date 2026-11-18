import { useId } from 'react';
import { Clock, HeartPulse, Languages } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { CountUp, EASE_OUT, Reveal, SectionTag } from '@/design-system';
import { STAGES } from '@/app/domain/stages';
import { JARGON } from '@/app/domain/plainLanguage';

const POINTS = [
  { x: 120, y: 292, label: 'Contract', hot: false },
  { x: 330, y: 238, label: 'Survey', hot: false },
  { x: 600, y: 182, label: 'Design', hot: false },
  { x: 870, y: 128, label: 'Permit', hot: true },
  { x: 1090, y: 62, label: 'Done', hot: false },
];

const CURVE = 'M0 320 C 60 310, 90 300, 120 292 S 280 250, 330 238 S 520 200, 600 182 S 790 150, 870 128 S 1030 90, 1090 62 S 1160 30, 1200 22';

function Chart() {
  const reduce = useReducedMotion();
  const still = reduce ? false : undefined;
  return (
    <figure>
      <svg viewBox="0 0 1200 360" role="img" aria-label="Illustrative chart: a project climbing through stages, with a blocker at Permitting" className="h-auto w-full overflow-visible">
        <defs>
          <linearGradient id="progress-fill" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" style={{ stopColor: 'var(--color-wash-sky)', stopOpacity: 0 }} />
            <stop offset="60%" style={{ stopColor: 'var(--color-wash-sky)', stopOpacity: 0.35 }} />
            <stop offset="100%" style={{ stopColor: 'var(--color-wash-peach)', stopOpacity: 0.85 }} />
          </linearGradient>
          <linearGradient id="progress-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" style={{ stopColor: 'var(--color-ink-tertiary)', stopOpacity: 0.45 }} />
            <stop offset="100%" style={{ stopColor: 'var(--color-ember-600)', stopOpacity: 0.95 }} />
          </linearGradient>
          <filter id="soft-shadow" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="6" stdDeviation="7" floodOpacity="0.16" style={{ floodColor: 'var(--color-ink-primary)' }} />
          </filter>
        </defs>

        <motion.path d={`${CURVE} L 1200 330 L 0 330 Z`} fill="url(#progress-fill)" initial={still ?? { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: EASE_OUT }} />
        <motion.path
          d={CURVE}
          fill="none"
          stroke="url(#progress-line)"
          strokeWidth="3.5"
          strokeLinecap="round"
          initial={still ?? { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: EASE_OUT }}
        />

        {POINTS.map((p, i) => (
          <motion.g key={p.label} initial={still ?? { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.5 + i * 0.28, ease: EASE_OUT }}>
            <line x1={p.x} x2={p.x} y1={p.y + 26} y2="330" strokeWidth="2" strokeDasharray="1 9" strokeLinecap="round" className="stroke-line-strong/50" />
            {p.hot && !reduce && (
              <motion.circle cx={p.x} cy={p.y} r="22" className="fill-ember-600/25" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} animate={{ scale: [1, 1.9], opacity: [0.7, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }} />
            )}
            <circle cx={p.x} cy={p.y} r="21" filter="url(#soft-shadow)" className="fill-paper-raised" />
            <circle cx={p.x} cy={p.y} r="7" className={p.hot ? 'fill-ember-600' : 'fill-ink-secondary/80'} />
          </motion.g>
        ))}
      </svg>
      <div aria-hidden="true" className="mt-4 grid grid-cols-5 text-xs text-ink-secondary uppercase">
        {POINTS.map((p, i) => (
          <span key={p.label} className={i === 0 ? '' : i === POINTS.length - 1 ? 'text-right' : 'text-center'}>
            {p.label}
          </span>
        ))}
      </div>
      <figcaption className="mt-4 text-xs text-ink-tertiary">Illustrative journey. The glowing point is a blocker that Groundwork would flag.</figcaption>
    </figure>
  );
}

const STATS = [
  { icon: <Clock />, label: 'Stages tracked', value: String(STAGES.length), body: 'from signed contract to permission to operate, each with a target and a checklist.' },
  { icon: <HeartPulse />, label: 'Health states', value: '4', body: 'blocked, at risk, on track and complete, each with the reason in words.' },
  { icon: <Languages />, label: 'Jargon terms', value: String(JARGON.length), body: 'flagged and replaced with plain language before an update is sent.' },
];

export function Results() {
  const headingId = useId();
  return (
    <section id="results" aria-labelledby={headingId} className="scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-10 sm:py-14 md:py-20">
        <SectionTag label="At a glance" />
        <h2 id={headingId} className="mt-8 max-w-xl text-3xl leading-[1] font-medium tracking-[-0.03em] sm:text-4xl text-balance md:text-heading">
          Progress you can see and follow
        </h2>
        <p className="mt-6 max-w-md text-md leading-snug text-ink-secondary">Every project shows where it is, what is in the way, and what happens next.</p>
        <Reveal className="mt-10">
          <Chart />
        </Reveal>
        <dl className="mt-12 grid gap-8 md:mt-16 md:grid-cols-3 md:gap-6">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} className="border-t border-line-default pt-5">
              <dt className="flex items-center gap-2 text-base [&_svg]:size-4">
                <span className="text-ink-tertiary">/0{i + 1}</span>
                <span aria-hidden="true">{s.icon}</span>
                {s.label}
              </dt>
              <dd>
                <span className="mt-4 flex items-center gap-5 md:block">
                  <span className="block min-w-20 shrink-0 text-6xl leading-none font-medium tracking-[-0.05em] tabular md:mt-8 md:w-auto md:text-7xl"><CountUp value={Number(s.value)} duration={1.5} /></span>
                  <span className="block max-w-xs text-base text-ink-secondary md:mt-4">{s.body}</span>
                </span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
