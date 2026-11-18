import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUp, ArrowUpRight, Check, FileText, FolderSync, Mic, MessageSquareText } from 'lucide-react';
import { Avatar, EASE_OUT, Reveal, cx } from '@/design-system';
import { Link } from '@/app/router';
import { PHOTOS } from './images';
import { coreButton } from './coreButton';
import { DISCLAIMER } from './shared';

/** A floating image or chip, placed by pixel offsets that follow the reference: tablet values first, then the wide-desktop ones. */
function Float({ className, delay, children }: { className: string; delay: number; children: ReactNode }) {
  return (
    <Reveal y={14} delay={delay} className={cx('absolute', className)}>
      {children}
    </Reveal>
  );
}

const IMG = 'size-full rounded-md object-cover';
const CHIP = 'flex items-center gap-4 rounded-md bg-core-chip px-4 text-base tracking-[0.01em]';

/** The four clusters of decoration. Illustrative only: nothing here is a real file, message or customer. */
function Decoration() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
      {/* Top left: a photo with a file chip */}
      <Float delay={0.2} className="top-[176px] left-10 h-[158px] w-[131px] xl:top-[184px] xl:left-[127px] xl:h-[187px] xl:w-[156px]">
        <img src={PHOTOS.homeowner.src} alt="" decoding="async" className={cx(IMG, 'object-[30%_50%]')} />
      </Float>
      <Float delay={0.3} className="top-[250px] left-[83px] xl:top-[279px] xl:left-[164px]">
        <div className={cx(CHIP, 'h-14 w-[244px] xl:w-[248px]')}>
          <FileText className="size-6 shrink-0" />
          <span>Permit_Delgado.pdf</span>
        </div>
      </Float>

      {/* Top right: three stacked photos with a folder chip */}
      <Float delay={0.25} className="top-[152px] right-10 h-[111px] w-[93px] xl:top-[171px] xl:right-[125px] xl:h-[122px] xl:w-[102px]">
        <img src={PHOTOS.installers.src} alt="" decoding="async" className={cx(IMG, 'object-[70%_50%]')} />
      </Float>
      <Float delay={0.3} className="top-[165px] right-14 h-[111px] w-[93px] xl:top-[184px] xl:right-[141px] xl:h-[122px] xl:w-[102px]">
        <img src={PHOTOS.coordinator.src} alt="" decoding="async" className={cx(IMG, 'object-[50%_30%]')} />
      </Float>
      <Float delay={0.35} className="top-[183px] right-[68px] h-[111px] w-[93px] xl:top-[197px] xl:right-[151px] xl:h-[122px] xl:w-[102px]">
        <img src={PHOTOS.homeowner.src} alt="" decoding="async" className={cx(IMG, 'object-[80%_40%]')} />
      </Float>
      <Float delay={0.45} className="top-[193px] right-[98px] xl:top-[222px] xl:right-[184px]">
        <div className={cx(CHIP, 'h-[72px] w-[232px] xl:h-16 xl:w-[236px]')}>
          <FolderSync className="size-6 shrink-0" />
          <span className="grid gap-0.5">
            <span>Today queue</span>
            <span className="text-xs tracking-[0.015em] text-core-muted">5 need you · Monday</span>
          </span>
        </div>
      </Float>

      {/* Bottom left: a photo with a message box */}
      <Float delay={0.4} className="top-[648px] left-14 h-[120px] w-[174px] xl:top-[609px] xl:left-[74px] xl:h-[175px] xl:w-[256px]">
        <img src={PHOTOS.installers.src} alt="" decoding="async" className={cx(IMG, 'object-[60%_40%]')} />
      </Float>
      <Float delay={0.5} className="top-[593px] left-[59px] xl:top-[667px] xl:left-[135px]">
        <div className={cx(CHIP, 'h-14 w-[249px] gap-3')}>
          <MessageSquareText className="size-5 shrink-0" />
          <span className="flex-1 text-xs tracking-[0.015em] text-core-muted">Text Maria…</span>
          <Mic className="size-4 shrink-0 text-core-muted" />
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-core-ink text-core-chip">
            <ArrowUp className="size-3.5" />
          </span>
        </div>
      </Float>

      {/* Bottom right: a photo with a status chip */}
      <Float delay={0.45} className="top-[622px] right-8 h-[155px] w-[125px] xl:top-[642px] xl:right-[206px] xl:h-[238px] xl:w-[192px]">
        <img src={PHOTOS.coordinator.src} alt="" decoding="async" className={cx(IMG, 'object-[20%_50%]')} />
      </Float>
      <Float delay={0.55} className="top-[672px] right-10 xl:top-[759px] xl:right-[105px]">
        <div className={cx(CHIP, 'h-[72px] w-[250px] gap-3 xl:h-16 xl:w-[251px]')}>
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

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative overflow-hidden border-b border-line-subtle bg-core-canvas pt-[22.5rem] pb-16 font-inter text-core-ink md:min-h-[800px] md:pt-[17.5rem] xl:min-h-[900px] xl:pt-[22.4rem]"
    >
      <Decoration />

      {/* The black dot above the headline, as in the reference. */}
      <motion.span
        aria-hidden="true"
        className="absolute top-[265px] left-1/2 size-[30px] -translate-x-1/2 rounded-full bg-core-ink md:top-[172px] xl:top-[239px]"
        animate={reduce ? undefined : { scale: [1, 1.18, 1] }}
        transition={{ duration: 3.2, ease: 'easeInOut', repeat: Infinity }}
      />

      <div className="relative mx-auto max-w-[1280px] px-4 text-center">
        <h1 id="hero-title" className="font-display text-[3.5rem] leading-none font-normal tracking-[-0.014em] text-balance md:text-[4.5rem] xl:text-[5.5rem]">
          <HeadlineLine delay={0.05}>Groundwork</HeadlineLine>
          <HeadlineLine delay={0.13}>From signed to switched on.</HeadlineLine>
        </h1>

        <Reveal delay={0.3}>
          <p className="mx-auto mt-6 max-w-[628px] text-md leading-6 tracking-[-0.0075em] md:text-[1.25rem]">
            One place for coordinators to see which installs are stuck, move every stage along, and tell homeowners where things stand.
          </p>
        </Reveal>

        <Reveal delay={0.36} className="mt-6 flex flex-wrap justify-center gap-4">
          <Link to="/case-study" className={coreButton('outline')}>
            Case study
          </Link>
          <Link to="/app" className={coreButton('solid')}>
            Try the prototype <ArrowUpRight aria-hidden="true" />
          </Link>
        </Reveal>

        <motion.div initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.5 }}>
          <p className="mx-auto mt-6 max-w-[430px] text-xs leading-4 tracking-[0.015em] text-core-muted">
            <span className="font-medium text-core-ink">{DISCLAIMER}</span> A working prototype with fictional data. Messages are simulated.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
