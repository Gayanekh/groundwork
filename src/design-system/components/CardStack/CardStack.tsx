import { Children, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cx } from '../../lib/cx';
import { SPRING_SOFT } from '../../lib/motion';

export interface CardStackProps {
  /** Each child becomes one floating card. Three or four read best. */
  children: ReactNode;
  /** Seconds before the first card arrives. Later cards follow 0.12s apart. */
  delay?: number;
  /** Give each card a slow, small idle float so the stack feels alive. Stops with reduced motion. */
  float?: boolean;
  /** Width and placement only, e.g. "w-full max-w-sm". */
  className?: string;
}

/**
 * A stack of floating white cards, offset left and right in turn, like product pages show
 * real UI on top of a gradient. Cards arrive one after another from alternating sides.
 * The cards are live components, so there is no device frame and no empty screen to fill.
 */
export function CardStack({ children, delay = 0, float = false, className }: CardStackProps) {
  const reduce = useReducedMotion();
  return (
    <div className={cx('flex flex-col gap-3', className)}>
      {Children.toArray(children).map((child, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        return (
          <motion.div
            key={i}
            className={i % 2 === 0 ? 'mr-5 sm:mr-8' : 'ml-5 sm:ml-8'}
            animate={float && !reduce ? { y: [0, -6, 0] } : undefined}
            transition={float ? { duration: 5.5 + i * 0.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.6 } : undefined}
          >
            <motion.div
              className="rounded-2xl border border-line-subtle bg-paper-raised p-4 text-ink-primary shadow-float sm:p-5"
              initial={reduce ? false : { opacity: 0, x: side * 36, y: 24 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ ...SPRING_SOFT, delay: delay + i * 0.12 }}
            >
              {child}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
