import { tokens } from '../tokens/tokens';

/**
 * Motion constants for the `motion` package, derived from the same tokens as the CSS
 * (`--ease-*`, `--duration-*`) so JS and CSS animation never disagree.
 */
type Bezier = [number, number, number, number];

const bezier = (css: string): Bezier => css.replace(/cubic-bezier\(|\)/g, '').split(',').map(Number) as Bezier;
const seconds = (ms: string) => parseFloat(ms) / 1000;

/** Entrances: elements arriving on screen. */
export const EASE_OUT = bezier(tokens['ease.out']);
/** State changes. */
export const EASE_STANDARD = bezier(tokens['ease.standard']);

/** UI transitions, in seconds. Keep interactive motion at or below `slow` (under 300ms). */
export const DURATION = {
  fast: seconds(tokens['duration.fast']),
  base: seconds(tokens['duration.base']),
  slow: seconds(tokens['duration.slow']),
} as const;

/** One-time editorial reveals (scroll into view). Longer than UI motion, never used for repeated actions. */
export const REVEAL_DURATION = 0.6;

/** Soft spring for scroll reveals: arrives smoothly, no bounce. */
export const SPRING_SOFT = { type: 'spring', stiffness: 400, damping: 70, mass: 1 } as const;
/** A touch livelier, for scale-ins. */
export const SPRING_POP = { type: 'spring', stiffness: 400, damping: 30, mass: 1 } as const;
