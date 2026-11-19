import { createContext, useContext, useLayoutEffect, useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { ArrowUp, ArrowUpRight, Check, FileText, FolderSync, Mic, MessageSquareText } from 'lucide-react';
import { Avatar, EASE_OUT, Reveal, cx } from '@/design-system';
import { Link } from '@/app/router';
import { PHOTOS } from './images';
import { coreButton } from '@/app/layout/coreButton';
import { DISCLAIMER } from './shared';

/** 0 while the hero is first on screen, 1 once the cards have fanned out into their places. */
const Settle = createContext<MotionValue<number> | null>(null);

/**
 * Where each card sits while the hero is first on screen: a loose pile, centred in the open space between the
 * nav bar and the headline. x and y are offsets from the pile's centre in pixels, r is a tilt in degrees and
 * s a scale. The order matches the cards in the hero, so chips land on top of their photos.
 */
const PILE = [
  { x: -70, y: 8, r: -9, s: 0.5 }, // top left photo
  { x: -45, y: 38, r: -5, s: 0.7 }, // file chip
  { x: 30, y: -20, r: 8, s: 0.55 }, // top right photos
  { x: 50, y: -5, r: 4, s: 0.55 },
  { x: 70, y: 10, r: -2, s: 0.55 },
  { x: 55, y: 36, r: 5, s: 0.7 }, // folder chip
  { x: -15, y: -12, r: 5, s: 0.5 }, // bottom left photo
  { x: -30, y: 20, r: -3, s: 0.7 }, // message chip
  { x: 25, y: 0, r: -6, s: 0.5 }, // bottom right photo
  { x: 20, y: 40, r: 3, s: 0.7 }, // status chip
];

/** How high the pile sits, as a share of the hero's height. */
const PILE_TOP = 0.22;

/**
 * One floating image or chip. The hero stays pinned while you scroll, and the card glides from the pile to its
 * place (transform only). Its edges sit at a percentage of the hero's width and height, and the images are sized
 * in the --u unit (see Hero), so the cluster scales with the viewport. To know how far to travel, the card
 * measures where it will end up and where the pile is, and re-measures when the hero is resized.
 * Chips keep their natural size so their text never gets squeezed.
 */
function Float({ className, i, children }: { className: string; i: number; children: ReactNode }) {
  const settle = useContext(Settle);
  if (!settle) throw new Error('Float must be used inside the hero.');
  const ref = useRef<HTMLDivElement>(null);
  const toPileX = useMotionValue(0);
  const toPileY = useMotionValue(0);
  const pile = PILE[i]!;

  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.offsetParent as HTMLElement | null;
    if (!el || !parent) return;
    const measure = () => {
      // offset* ignores transforms, so this is where the card sits once it has settled.
      toPileX.set(parent.offsetWidth / 2 + pile.x - (el.offsetLeft + el.offsetWidth / 2));
      toPileY.set(parent.offsetHeight * PILE_TOP + pile.y - (el.offsetTop + el.offsetHeight / 2));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(parent);
    ro.observe(el);
    return () => ro.disconnect();
  }, [pile.x, pile.y, toPileX, toPileY]);

  // Sideways first (done by 60% of the scroll), then down: the cards leave the text column before they drop past it.
  const x = useTransform([settle, toPileX], ([t, d]: number[]) => {
    const u = Math.min(1, t! / 0.6);
    return (1 - u * (2 - u)) * d!;
  });
  const y = useTransform([settle, toPileY], ([t, d]: number[]) => (1 - t! ** 3) * d!);
  const rotate = useTransform(settle, [0, 1], [pile.r, 0]);
  const scale = useTransform(settle, [0, 1], [pile.s, 1]);
  return (
    <motion.div ref={ref} style={{ x, y, rotate, scale }} className={cx('absolute', className)}>
      {children}
    </motion.div>
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
      <Float i={0} className="top-[20.4%] left-[8.8%] h-[calc(var(--u)*13)] w-[calc(var(--u)*10.83)]">
        <img src={PHOTOS.homeowner.src} alt="" decoding="async" className={cx(IMG, 'object-[30%_50%]')} />
      </Float>
      <Float i={1} className="top-[31%] left-[11.4%]">
        <div className={CHIP}>
          <FileText className="size-6 shrink-0" />
          <span>Permit_Delgado.pdf</span>
        </div>
      </Float>

      {/* Top right: three stacked photos with a folder chip */}
      <Float i={2} className="top-[19%] right-[8.7%] h-[calc(var(--u)*8.47)] w-[calc(var(--u)*7.08)]">
        <img src={PHOTOS.installers.src} alt="" decoding="async" className={cx(IMG, 'object-[70%_50%]')} />
      </Float>
      <Float i={3} className="top-[20.4%] right-[9.8%] h-[calc(var(--u)*8.47)] w-[calc(var(--u)*7.08)]">
        <img src={PHOTOS.coordinator.src} alt="" decoding="async" className={cx(IMG, 'object-[50%_30%]')} />
      </Float>
      <Float i={4} className="top-[21.9%] right-[10.5%] h-[calc(var(--u)*8.47)] w-[calc(var(--u)*7.08)]">
        <img src={PHOTOS.homeowner.src} alt="" decoding="async" className={cx(IMG, 'object-[80%_40%]')} />
      </Float>
      <Float i={5} className="top-[24.7%] right-[12.8%]">
        <div className={CHIP}>
          <FolderSync className="size-6 shrink-0" />
          <span className="grid gap-0.5">
            <span>Today queue</span>
            <span className="text-xs tracking-[0.015em] text-core-muted">5 need you · Monday</span>
          </span>
        </div>
      </Float>

      {/* Bottom left: a photo with a message box */}
      <Float i={6} className="top-[67.7%] left-[5.1%] h-[calc(var(--u)*12.2)] w-[calc(var(--u)*17.8)]">
        <img src={PHOTOS.installers.src} alt="" decoding="async" className={cx(IMG, 'object-[60%_40%]')} />
      </Float>
      <Float i={7} className="top-[74.1%] left-[9.4%]">
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
      <Float i={8} className="top-[71.3%] right-[14.3%] h-[calc(var(--u)*16.5)] w-[calc(var(--u)*13.3)]">
        <img src={PHOTOS.coordinator.src} alt="" decoding="async" className={cx(IMG, 'object-[20%_50%]')} />
      </Float>
      <Float i={9} className="top-[84.3%] right-[7.3%]">
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
 * - The hero is pinned for a short scroll while the cards fan out from a pile in the middle to their places.
 *   That only happens where the cards show (wide and tall enough). With reduced motion there is no pinning and
 *   the cards simply sit in their places.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  const raw = useTransform(scrollYProgress, [0, 0.8], [0, 1], { clamp: true });
  const scrolled = useSpring(raw, { stiffness: 140, damping: 26, mass: 0.6 });
  const still = useMotionValue(1);
  return (
    <Settle.Provider value={reduce ? still : scrolled}>
      <div ref={track} className={cx('relative border-b border-line-subtle', !reduce && 'lg:[@media(min-height:621px)]:h-[170svh]')}>
        <section
          id="top"
          aria-labelledby="hero-title"
          className={cx(
            'flex min-h-svh flex-col justify-center overflow-hidden bg-core-canvas font-inter text-core-ink',
            !reduce && 'lg:[@media(min-height:621px)]:sticky lg:[@media(min-height:621px)]:top-0',
            // --u: one design unit (1/100 of the 1440x900 layout), limited by whichever of width or height is tighter.
            '[--u:min(1vw,1.6svh)]',
            'pt-[max(6.25rem,calc(env(safe-area-inset-top)+5.5rem))] pb-[max(1.5rem,env(safe-area-inset-bottom))]',
            'px-[max(1rem,env(safe-area-inset-left))]',
          )}
        >
          <Decoration />

          <div className="relative mx-auto w-full max-w-[1280px] text-center">
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
              <p className="mx-auto mt-[clamp(0.75rem,2.6svh,1.5rem)] max-w-[20rem] text-xs leading-4 tracking-[0.015em] text-core-muted xl:max-w-[430px]">
                <span className="font-medium text-core-ink">{DISCLAIMER}</span> A working prototype with fictional data. Messages are simulated.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </Settle.Provider>
  );
}
