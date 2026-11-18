import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, HeartPulse, Inbox, MessageSquareText, ShieldCheck } from 'lucide-react';
import { Atmosphere, Avatar, CardStack, CountUp, EASE_OUT, Panel, Reveal, buttonStyles, cx } from '@/design-system';
import { Link } from '@/app/router';
import { HealthBadge } from '@/app/features/projectUi';
import { PHOTOS } from './images';
import { jumpTo } from './scroll';

const HIGHLIGHTS = [
  { icon: <Inbox />, title: 'Today queue', text: 'Ranked by what is stuck', to: 'solution' },
  { icon: <HeartPulse />, title: 'Status in words', text: 'Every flag has a reason', to: 'features' },
  { icon: <ShieldCheck />, title: 'Guardrails', text: 'Rules, not warnings', to: 'features' },
  { icon: <MessageSquareText />, title: 'Plain updates', text: 'Homeowners read plain words', to: 'plain' },
];

/** One line of the headline, revealed upward from behind a mask. Transform only. */
function HeadlineLine({ children, delay }: { children: ReactNode; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
      <motion.span className="block" initial={reduce ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: EASE_OUT, delay }}>
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  return (
    <div className="relative isolate">
      <Atmosphere className="absolute inset-0 -z-10" />
      <section id="top" aria-labelledby="hero-title" className="mx-auto max-w-7xl px-4 pt-28 pb-12 sm:px-10 md:pt-32 md:pb-16">
        <div className="grid gap-x-10 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal y={8}>
              <p className="inline-flex rounded-full border border-ink-primary/25 bg-paper-raised/50 px-3.5 py-1.5 text-sm uppercase">Project operations</p>
            </Reveal>
            <h1 id="hero-title" className="mt-6 text-4xl leading-[0.95] font-medium tracking-[-0.04em] md:text-heading">
              <HeadlineLine delay={0.05}>Signed to</HeadlineLine>
              <HeadlineLine delay={0.13}>switched on,</HeadlineLine>
              <HeadlineLine delay={0.21}>
                <span className="text-ember-600">without the silence.</span>
              </HeadlineLine>
            </h1>
            <Reveal delay={0.3}>
              <p className="mt-8 max-w-lg text-md leading-snug text-ink-secondary md:text-lg">
                Groundwork shows project coordinators which home-energy installs need them today, keeps every stage moving, and tells homeowners where things stand in plain words.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/app" className={`${buttonStyles({ variant: 'primary', size: 'lg', press: true, pill: true })} w-full sm:w-auto`}>
                  Try the prototype <ArrowRight aria-hidden="true" />
                </Link>
                <Link to="/case-study" className={`${buttonStyles({ variant: 'secondary', size: 'lg', press: true, pill: true })} w-full sm:w-auto`}>
                  Read the case study
                </Link>
              </div>
              <p className="mt-5 max-w-md text-sm leading-snug text-ink-secondary">
                <span className="font-medium text-ink-primary">Independent Speculative Concept.</span> A working prototype with fictional data. Messages are simulated.
              </p>
            </Reveal>
          </div>

          <figure className="mx-auto w-full max-w-md lg:col-span-5 lg:ml-auto lg:self-center">
            <Reveal from="right">
              <div className="relative">
                <div className="aspect-square overflow-hidden rounded-3xl bg-paper-sunken sm:aspect-4/5">
                  <img src={PHOTOS.installers.src} alt={PHOTOS.installers.alt} decoding="async" className="size-full object-cover object-[62%_50%]" />
                </div>
                <CardStack delay={0.6} float className="relative z-10 -mt-12 ml-3 w-[92%] sm:absolute sm:-bottom-8 sm:-left-10 sm:mt-0 sm:ml-0 sm:w-[88%]">
                  <div>
                    <div className="flex items-center gap-3">
                      <Avatar name="Maria Delgado" size="lg" decorative />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-md font-semibold tracking-tight">Maria Delgado</p>
                        <p className="truncate text-sm text-ink-tertiary">Solar + battery · Riverside</p>
                      </div>
                      <HealthBadge health="blocked" size="sm" shape="pill" />
                    </div>
                    <div className="mt-4 flex items-end gap-3">
                      <span className="text-6xl leading-none font-medium tracking-[-0.05em] text-danger-fg">
                        <CountUp value={26} suffix="d" duration={1.6} />
                      </span>
                      <span className="pb-1 text-sm leading-snug text-ink-secondary">
                        in Permitting.
                        <br />
                        Target is 21 days.
                      </span>
                    </div>
                  </div>
                </CardStack>
              </div>
            </Reveal>
            <figcaption className="mt-4 text-xs text-ink-tertiary sm:mt-14">
              Illustrative photo · Photo: {PHOTOS.installers.photographer} / Unsplash
            </figcaption>
          </figure>

          <Reveal delay={0.45} className="lg:col-span-12">
            <Panel padding="none" elevated radius="2xl" className="lg:mt-4">
              <ul className="grid grid-cols-2 lg:grid-cols-4">
                {HIGHLIGHTS.map((h, i) => (
                  <li key={h.title} className={cx('border-line-subtle', i % 2 === 1 && 'border-l', i >= 2 && 'border-t lg:border-t-0', i > 0 && 'lg:border-l')}>
                    <a href={`#${h.to}`} onClick={jumpTo(h.to)} className="group flex h-full items-center gap-3 p-4 transition-colors duration-fast ease-standard hover:bg-paper-base sm:gap-4 sm:p-5">
                      <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-ember-50 text-ember-700 transition-transform duration-base ease-out group-hover:scale-105 [&_svg]:size-5">
                        {h.icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-base font-semibold tracking-tight">{h.title}</span>
                        <span className="block text-sm leading-snug text-ink-secondary">{h.text}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Panel>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
