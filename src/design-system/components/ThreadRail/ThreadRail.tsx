import { useEffect, useState } from 'react';
import { motion, useReducedMotion, useScroll } from 'motion/react';
import { cx } from '../../lib/cx';

export interface ThreadStop {
  /** Id of the section element this stop links to. */
  id: string;
  label: string;
}

export interface ThreadRailProps {
  stops: ReadonlyArray<ThreadStop>;
  /** Accessible name of the navigation, e.g. "Page sections". */
  label: string;
  className?: string;
}

/**
 * The "thread": a fixed vertical line down the page edge that fills as you scroll, with a
 * stop for each section. It is also real navigation: each stop is a link with a text label
 * (shown on hover and focus). Large screens only; small screens rely on the header menu.
 */
export function ThreadRail({ stops, label, className }: ThreadRailProps) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [active, setActive] = useState(stops[0]?.id);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    for (const s of stops) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [stops]);

  return (
    <nav aria-label={label} className={cx('pointer-events-none fixed top-1/2 left-3 z-20 hidden h-[44vh] -translate-y-1/2 lg:block xl:left-6', className)}>
      <span aria-hidden="true" className="absolute top-0 bottom-0 left-[7px] w-px bg-line-strong" />
      {!reduce && <motion.span aria-hidden="true" style={{ scaleY: scrollYProgress }} className="absolute top-0 bottom-0 left-[7px] w-0.5 origin-top bg-ember-600" />}
      <ol className="relative flex h-full flex-col justify-between">
        {stops.map((s, i) => {
          const on = s.id === active;
          return (
            <li key={s.id} className="pointer-events-auto">
              <a href={`#${s.id}`} aria-current={on ? 'location' : undefined} className="group relative flex size-4 items-center justify-center rounded-full">
                <span
                  aria-hidden="true"
                  className={cx(
                    'rounded-full ring-2 ring-paper-base transition-[transform,background-color] duration-base ease-out',
                    on ? 'size-3 bg-ember-600' : 'size-2 bg-line-strong group-hover:scale-125 group-hover:bg-ink-secondary',
                  )}
                />
                <span className="pointer-events-none absolute left-6 z-10 -translate-x-1 rounded-sm bg-paper-inverse px-2 py-1 font-mono text-2xs whitespace-nowrap text-ink-inverse opacity-0 transition-[opacity,transform] duration-fast ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
                  {String(i + 1).padStart(2, '0')} · {s.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
