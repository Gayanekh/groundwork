import { cx } from '@/design-system';

/**
 * Link-buttons for the landing hero and its nav bar: flat, 40px tall, 14px Inter, 8px corners.
 * Lives with the landing page because it is a one-off look, not a general design-system variant.
 * - solid: near-black fill that fades to an outline on hover (on the white hero)
 * - outline: 1px near-black outline (on the white hero)
 * - light: light fill that fades to an outline on hover (on the dark bar)
 * - outline-light: 1px light outline (on the dark bar)
 */
export function coreButton(variant: 'solid' | 'outline' | 'light' | 'outline-light', className?: string) {
  return cx(
    'inline-flex h-10 items-center justify-center gap-2 rounded-md px-6 font-inter text-base tracking-[0.01em] whitespace-nowrap transition-[background-color,border-color,color,transform] duration-300 ease-standard active:scale-[0.97] [&_svg]:size-4',
    variant === 'solid' && 'border border-core-ink bg-core-ink text-core-chip hover:bg-transparent hover:text-core-ink',
    variant === 'outline' && 'border border-core-ink text-core-ink hover:bg-core-card',
    variant === 'light' && 'border border-core-chip bg-core-chip text-core-ink hover:bg-transparent hover:text-core-chip',
    variant === 'outline-light' && 'border border-core-chip/40 text-core-chip hover:bg-core-chip/15',
    className,
  );
}
