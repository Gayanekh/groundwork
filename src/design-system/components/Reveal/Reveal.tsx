import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { SPRING_POP, SPRING_SOFT } from '../../lib/motion';

const tags = { div: motion.div, li: motion.li, p: motion.p, figure: motion.figure, span: motion.span } as const;

export interface RevealProps {
  children: ReactNode;
  /** Element to render. Use `li` inside lists and `figure` for captioned media. */
  as?: keyof typeof tags;
  /** Where it arrives from: below, the left, the right, or growing from 92% size. */
  from?: 'up' | 'left' | 'right' | 'scale';
  /** Seconds to wait before starting. Stagger siblings by 0.1. */
  delay?: number;
  /** Travel distance in px for up, left and right. */
  y?: number;
  /** Reveal once (default) or every time it enters the viewport. */
  once?: boolean;
  className?: string;
}

/**
 * Scroll reveal on a soft spring: fades in while travelling a short way, the first time it enters
 * the viewport. Animates only `opacity` and `transform`. With reduced motion the content is simply shown.
 */
export function Reveal({ children, as = 'div', from = 'up', delay = 0, y = 40, once = true, className }: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = tags[as] as typeof motion.div;
  if (reduce) return <Tag className={className}>{children}</Tag>;
  const initial = from === 'up' ? { opacity: 0, y } : from === 'left' ? { opacity: 0, x: -y } : from === 'right' ? { opacity: 0, x: y } : { opacity: 0, scale: 0.92 };
  return (
    <Tag
      className={className}
      initial={initial}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once, margin: '0px 0px -10% 0px' }}
      transition={{ ...(from === 'scale' ? SPRING_POP : SPRING_SOFT), delay }}
    >
      {children}
    </Tag>
  );
}
