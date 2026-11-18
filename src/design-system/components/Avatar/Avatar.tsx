import { createContext, useContext, type ReactNode } from 'react';
import { cx } from '../../lib/cx';

const PhotoContext = createContext<Record<string, string>>({});

/**
 * Supplies portrait photos to every Avatar below it, keyed by the person's full name.
 * People who are not in the map keep their initials, so a mix of photos and initials is fine.
 */
export function AvatarPhotos({ photos, children }: { photos: Record<string, string>; children: ReactNode }) {
  return <PhotoContext.Provider value={photos}>{children}</PhotoContext.Provider>;
}

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
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Portrait image. When omitted, a photo from the nearest `AvatarPhotos` is used if one exists for this name; otherwise initials. */
  src?: string;
  /** When the name is shown next to the avatar, hide it from AT to avoid repetition. */
  decorative?: boolean;
  className?: string;
}

/** Round avatar: a portrait when one is available, otherwise initials on a deterministic tone per name. */
export function Avatar({ name, size = 'sm', src, decorative, className }: AvatarProps) {
  const photos = useContext(PhotoContext);
  const photo = src ?? photos[name];
  return (
    <span
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative || undefined}
      className={cx(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold select-none',
        size === 'xs' && 'size-5 text-[9px]',
        size === 'sm' && 'size-7 text-2xs',
        size === 'md' && 'size-9 text-xs',
        size === 'lg' && 'size-11 text-sm',
        palette[hash(name) % palette.length],
        className,
      )}
    >
      {photo ? <img src={photo} alt="" loading="lazy" decoding="async" draggable={false} className="size-full object-cover" /> : initials(name)}
    </span>
  );
}
