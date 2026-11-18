import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { cx } from '../../lib/cx';

export interface AtmosphereProps {
  /** Drift the wash slowly as the page scrolls. Ignored with reduced motion. */
  parallax?: boolean;
  /** `top`: sky above, fading into the page. `bottom`: page base above, coral rising from the bottom. */
  from?: 'top' | 'bottom';
  /** Fade the wash into paper.base at the far edge. Turn off inside a clipped panel. */
  fade?: boolean;
  /** Placement and size only, e.g. "absolute inset-0 -z-10". */
  className?: string;
}

/**
 * Decorative sky-to-coral wash: blurred color fields that fade into the page base.
 * It is purely visual (aria-hidden, no pointer events). Keep text on the pale sky and peach areas;
 * the strong coral sits low and to the right, behind white cards.
 * Colors come from the wash tokens; the fade ends on paper.base, so it follows `data-surface`.
 */
export function Atmosphere({ parallax = true, from = 'top', fade = true, className }: AtmosphereProps) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, 90]);
  const drift = parallax && !reduce ? { y } : undefined;
  return (
    <div aria-hidden="true" className={cx('pointer-events-none overflow-hidden in-data-[surface=core]:hidden', className)}>
      <motion.div style={drift} className="absolute inset-x-[-8%] -top-[8%] h-[116%]">
        {from === 'top' ? (
          <>
            <div className="absolute inset-0 bg-linear-to-b from-wash-sky via-wash-cloud to-paper-base" />
            <div className="absolute top-[34%] -left-[6%] h-[34%] w-[52%] rounded-full bg-wash-peach opacity-70 blur-3xl" />
            <div className="absolute top-[44%] right-[-4%] h-[40%] w-[62%] rounded-full bg-wash-coral opacity-80 blur-3xl" />
            <div className="absolute top-[26%] right-[18%] h-[26%] w-[40%] rounded-full bg-wash-peach opacity-80 blur-3xl" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-linear-to-b from-paper-base via-wash-cloud to-wash-sky" />
            <div className="absolute bottom-[4%] -left-[8%] h-[24%] w-[56%] rounded-full bg-wash-peach opacity-80 blur-3xl" />
            <div className="absolute -bottom-[6%] left-[22%] h-[26%] w-[78%] rounded-full bg-wash-coral opacity-80 blur-3xl" />
          </>
        )}
      </motion.div>
      {fade && from === 'top' && <div className="absolute inset-x-0 bottom-0 h-[28%] bg-linear-to-b from-transparent to-paper-base" />}
    </div>
  );
}
