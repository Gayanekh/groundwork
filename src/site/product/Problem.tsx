import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { DURATION, EASE_OUT, EditorialSection, Panel, Reveal, buttonStyles, cx } from '@/design-system';
import { Photo } from './Photo';
import { PHOTOS } from './images';
import { jumpTo } from './scroll';

const SLIDES = [
  { photo: PHOTOS.coordinator, lead: 'Stalled jobs hide among healthy ones.', stat: '26d', body: 'in permitting against a 21-day target, and nobody has flagged it.' },
  { photo: PHOTOS.homeowner, lead: 'Homeowners hear nothing, then jargon.', stat: '9 days', body: 'since the homeowner last heard from anyone on the team.' },
  { photo: PHOTOS.installers, lead: 'One coordinator carries dozens of projects.', stat: '40', body: 'active projects held in spreadsheets, inboxes and memory.' },
];

export function Problem() {
  const [i, setI] = useState(0);
  const s = SLIDES[i];
  return (
    <EditorialSection id="problem" label="Problem" align="split" title="Projects stall quietly while homeowners hear nothing.">
      <Reveal>
        <Panel padding="md" className="sm:p-6">
          <div className="grid gap-6 md:grid-cols-12 md:gap-8">
            <Reveal from="left" className="md:col-span-5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={i} className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: DURATION.base, ease: EASE_OUT }}>
                  <Photo photo={s.photo} ratio="fill" />
                </motion.div>
              </AnimatePresence>
            </Reveal>
            <Reveal from="right" delay={0.1} className="flex flex-col justify-between gap-10 md:col-span-7 md:py-2 md:pr-2">
              <div className="flex items-start justify-between gap-6">
                <p aria-live="polite" className="max-w-xs text-xl leading-snug tracking-tight">
                  {s.lead}
                </p>
                <div className="flex shrink-0 gap-0.5 pointer-coarse:-mt-2 pointer-coarse:-mr-2" role="group" aria-label="Examples">
                  {SLIDES.map((_, n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`Show example ${n + 1} of ${SLIDES.length}`}
                      aria-current={n === i ? 'true' : undefined}
                      onClick={() => setI(n)}
                      className="grid size-6 place-items-center rounded-full pointer-coarse:size-11"
                    >
                      <span className={cx('size-3 rounded-full transition-colors duration-fast ease-standard', n === i ? 'bg-ink-primary' : 'bg-line-strong hover:bg-ink-secondary')} />
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-7xl leading-none font-normal tracking-[-0.045em] md:text-8xl">{s.stat}</p>
              <div className="flex flex-wrap items-end justify-between gap-5">
                <p className="max-w-sm text-base leading-snug text-ink-secondary">{s.body}</p>
                <a href="#solution" onClick={jumpTo('solution')} className={buttonStyles({ variant: 'primary', pill: true, press: true })}>
                  See the fix <ArrowRight aria-hidden="true" />
                </a>
              </div>
            </Reveal>
          </div>
        </Panel>
        <p className="mt-4 px-2 text-xs text-ink-tertiary">Illustrative numbers from the Groundwork demo scenario. Not market data.</p>
      </Reveal>
    </EditorialSection>
  );
}
