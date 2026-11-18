import { cx } from '@/design-system';

export interface PhotoData {
  src: string;
  alt: string;
  photographer: string;
  /** Unsplash photo page, for the credit link. */
  pageUrl: string;
}

/**
 * Editorial photograph with a standing credit. Photos are illustrative stock imagery:
 * the people shown are not Groundwork customers and the page never says they are.
 */
export function Photo({ photo, className, ratio = 'landscape' }: { photo: PhotoData; className?: string; ratio?: 'landscape' | 'portrait' | 'wide' | 'fill' }) {
  return (
    <figure className={cx('min-w-0', ratio === 'fill' && 'flex h-full flex-col', className)}>
      <div className={cx('relative overflow-hidden bg-paper-sunken', ratio === 'fill' ? 'min-h-60 flex-1 rounded-2xl' : 'rounded-lg', ratio === 'landscape' && 'aspect-4/3', ratio === 'portrait' && 'aspect-4/5', ratio === 'wide' && 'aspect-video')}>
        <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className={cx('object-cover', ratio === 'fill' ? 'absolute inset-0 size-full' : 'size-full')} />
      </div>
      <figcaption className="mt-2 flex flex-wrap justify-between gap-x-4 text-2xs text-ink-tertiary">
        <span>Illustrative photo</span>
        <a href={photo.pageUrl} target="_blank" rel="noreferrer" className="underline-offset-2 hover:text-ink-primary hover:underline">
          Photo: {photo.photographer} / Unsplash
        </a>
      </figcaption>
    </figure>
  );
}
