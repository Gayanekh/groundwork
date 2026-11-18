import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUp, ArrowUpRight, Check, FileText, FolderSync, Mic, MessageSquareText } from 'lucide-react';
import { Avatar, EASE_OUT, Reveal, cx } from '@/design-system';
import { Link } from '@/app/router';
import { PHOTOS } from './images';
import { coreButton } from './coreButton';
import { DISCLAIMER } from './shared';

/**
 * Floating images and chips. Their edges sit at a percentage of the hero's width and height, and the
 * images are sized in `--u` (see Hero), so the whole cluster scales with the viewport instead of
 * keeping pixel offsets. Chips keep their natural size so their text never gets squeezed.
 */
function Float({ className, delay, children }: { className: string; delay: number; children: ReactNode }) {
  return (
    <Reveal y={14} delay={delay} className={cx('absolute', className)}>
      {children}
    </Reveal>
  );
}

const IMG = 'size-full rounded-md object-cover';
const CHIP = 'flex min-h-14 w-max items-center gap-4 rounded-md bg-core-chip px-4 py-2 text-base tracking-[0.01em]';

/** The four clusters of decoration. Illustrative only: nothing here is a real file, message or customer. */
function Decoration() {
  return (
    // Only where there is room beside the text: wide screens that are also tall enough.
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block [@media(max-height:620px)]:hidden">
      {/* Top left: a photo with a file chip */}
      <Float delay={0.2} className="top-[20.4%] left-[8.8%] h-[calc(var(--u)*13)] w-[calc(var(--u)*10.83)]">
        <img src={PHOTOS.homeowner.src} alt="" decoding="async" className={cx(IMG, 'object-[30%_50%]')} />
      </Float>
      <Float delay={0.3} className="top-[31%] left-[11.4%]">
        <div className={CHIP}>
          <FileText className="size-6 shrink-0" />
          <span>Permit_Delgado.pdf</span>
        </div>
      </Float>

      {/* Top right: three stacked photos with a folder chip */}
      <Float delay={0.25} className="top-[19%] right-[8.7%] h-[calc(var(--u)*8.47)] w-[calc(var(--u)*7.08)]">
        <img src={PHOTOS.installers.src} alt="" decoding="async" className={cx(IMG, 'object-[70%_50%]')} />
      </Float>
      <Float delay={0.3} className="top-[20.4%] right-[9.8%] h-[calc(var(--u)*8.47)] w-[calc(var(--u)*7.08)]">
        <img src={PHOTOS.coordinator.src} alt="" decoding="async" className={cx(IMG, 'object-[50%_30%]')} />
      </Float>
      <Float delay={0.35} className="top-[21.9%] right-[10.5%] h-[calc(var(--u)*8.47)] w-[calc(var(--u)*7.08)]">
        <img src={PHOTOS.homeowner.src} alt="" decoding="async" className={cx(IMG, 'object-[80%_40%]')} />
      </Float>
      <Float delay={0.45} className="top-[24.7%] right-[12.8%]">
        <div className={CHIP}>
          <FolderSync className="size-6 shrink-0" />
          <span className="grid gap-0.5">
            <span>Today queue</span>
            <span className="text-xs tracking-[0.015em] text-core-muted">5 need you · Monday</span>
          </span>
        </div>
      </Float>

      {/* Bottom left: a photo with a message box */}
      <Float delay={0.4} className="top-[67.7%] left-[5.1%] h-[calc(var(--u)*12.2)] w-[calc(var(--u)*17.8)]">
        <img src={PHOTOS.installers.src} alt="" decoding="async" className={cx(IMG, 'object-[60%_40%]')} />
      </Float>
      <Float delay={0.5} className="top-[74.1%] left-[9.4%]">
        <div className={cx(CHIP, 'gap-3')}>
          <MessageSquareText className="size-5 shrink-0" />
          <span className="pr-2 text-xs tracking-[0.015em] text-core-muted">Text Maria…</span>
          <Mic className="size-4 shrink-0 text-core-muted" />
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-core-ink text-core-chip">
            <ArrowUp className="size-3.5" />
          </span>
        </div>
      </Float>

      {/* Bottom right: a photo with a status chip */}
      <Float delay={0.45} className="top-[71.3%] right-[14.3%] h-[calc(var(--u)*16.5)] w-[calc(var(--u)*13.3)]">
        <img src={PHOTOS.coordinator.src} alt="" decoding="async" className={cx(IMG, 'object-[20%_50%]')} />
      </Float>
      <Float delay={0.55} className="top-[84.3%] right-[7.3%]">
        <div className={cx(CHIP, 'gap-3')}>
          <Avatar name="Devon Park" size="md" decorative />
          <span className="grid gap-0.5">
            <span className="text-xs tracking-[0.015em] text-core-muted">Devon, Project coordinator</span>
            <span className="flex items-center gap-2">
              <Check className="size-4 text-core-ink" />
              <span>Permit approved</span>
              <span className="text-core-muted">1h</span>
            </span>
          </span>
        </div>
      </Float>
    </div>
  );
}

/** One line of the headline, revealed upward from behind a mask. Transform only. */
function HeadlineLine({ children, delay }: { children: ReactNode; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span className="block" initial={reduce ? false : { y: '105%' }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: EASE_OUT, delay }}>
        {children}
      </motion.span>
    </span>
  );
}

/**
 * The hero fills the first screen and never needs scrolling to read it.
 * - Height is `100svh` (the small viewport height), so it still fits when a phone's address bar is showing.
 *   It is a minimum, not a fixed height: on a very short window the content keeps its size and the page scrolls.
 * - Type, gaps and the floating images scale with both the width and the height of the window.
 * - The top padding clears the floating nav bar; the sides and bottom respect device safe areas.
 */
export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className={cx(
        'relative flex min-h-svh flex-col justify-center overflow-hidden border-b border-line-subtle bg-core-canvas font-inter text-core-ink',
        // --u: one design unit (1/100 of the 1440x900 layout), limited by whichever of width or height is tighter.
        '[--u:min(1vw,1.6svh)]',
        'pt-[max(6.25rem,calc(env(safe-area-inset-top)+5.5rem))] pb-[max(1.5rem,env(safe-area-inset-bottom))]',
        'px-[max(1rem,env(safe-area-inset-left))]',
      )}
    >
      <Decoration />

      <div className="relative mx-auto w-full max-w-[1280px] text-center">
        {/* The black dot above the headline, as in the reference. */}
        <motion.span
          aria-hidden="true"
          className="mx-auto mb-[clamp(0.75rem,4.5svh,3.5rem)] block size-[30px] rounded-full bg-core-ink"
          animate={reduce ? undefined : { scale: [1, 1.18, 1] }}
          transition={{ duration: 3.2, ease: 'easeInOut', repeat: Infinity }}
        />

        <h1
          id="hero-title"
          className="font-display text-[clamp(2.5rem,min(14.4vw,9.5svh),5.5rem)] leading-none font-normal tracking-[-0.014em] text-balance md:text-[clamp(2.75rem,min(8.8vw,10svh),5.5rem)] xl:text-[clamp(2.75rem,min(6.1vw,10.5svh),5.5rem)]"
        >
          <HeadlineLine delay={0.05}>Groundwork</HeadlineLine>
          <HeadlineLine delay={0.13}>From signed to switched on.</HeadlineLine>
        </h1>

        <Reveal delay={0.3}>
          <p className="mx-auto mt-[clamp(0.75rem,2.6svh,1.5rem)] max-w-[628px] text-[clamp(0.9375rem,2.2svh,1.25rem)] leading-[1.2] tracking-[-0.0075em]">
            One place for coordinators to see which installs are stuck, move every stage along, and tell homeowners where things stand.
          </p>
        </Reveal>

        <Reveal delay={0.36} className="mt-[clamp(0.75rem,2.6svh,1.5rem)] flex flex-wrap justify-center gap-3 sm:gap-4">
          <Link to="/case-study" className={coreButton('outline')}>
            Case study
          </Link>
          <Link to="/app" className={coreButton('solid')}>
            Try the prototype <ArrowUpRight aria-hidden="true" />
          </Link>
        </Reveal>

        <motion.div initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.5 }}>
          <p className="mx-auto mt-[clamp(0.75rem,2.6svh,1.5rem)] max-w-[20rem] text-xs xl:max-w-[430px] leading-4 tracking-[0.015em] text-core-muted">
            <span className="font-medium text-core-ink">{DISCLAIMER}</span> A working prototype with fictional data. Messages are simulated.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
