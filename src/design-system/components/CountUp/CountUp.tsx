import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';
import { EASE_OUT } from '../../lib/motion';

export interface CountUpProps {
  /** The final number. Screen readers always get this value, never the in-between numbers. */
  value: number;
  /** Text after the number, e.g. "d" for days. */
  suffix?: string;
  /** Seconds to count. */
  duration?: number;
  className?: string;
}

/**
 * A number that rolls up from 0 the first time it scrolls into view. With reduced motion it shows
 * the final value at once. The animated digits are hidden from assistive tech; a visually hidden
 * copy carries the real value.
 */
export function CountUp({ value, suffix = '', duration = 1.4, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (reduce) {
      setN(value);
      return;
    }
    if (!inView) return;
    const controls = animate(0, value, { duration, ease: EASE_OUT, onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
  }, [inView, reduce, value, duration]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true" className="tabular">
        {n}
        {suffix}
      </span>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </span>
  );
}
