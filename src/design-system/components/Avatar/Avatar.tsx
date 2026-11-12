import { cx } from '../../lib/cx';

const palette = [
  'bg-ember-50 text-ember-700',
  'bg-info-bg text-info-fg',
  'bg-success-bg text-success-fg',
  'bg-warning-bg text-warning-fg',
  'bg-neutral-bg text-neutral-fg',
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

export interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md';
  /** When the name is shown next to the avatar, hide it from AT to avoid repetition. */
  decorative?: boolean;
  className?: string;
}

/** Initials avatar with a deterministic tone per name (no photos needed). */
export function Avatar({ name, size = 'sm', decorative, className }: AvatarProps) {
  return (
    <span
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative || undefined}
      className={cx(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold select-none',
        size === 'xs' && 'size-5 text-[9px]',
        size === 'sm' && 'size-7 text-2xs',
        size === 'md' && 'size-9 text-xs',
        palette[hash(name) % palette.length],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
