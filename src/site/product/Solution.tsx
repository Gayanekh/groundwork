import type { ReactNode } from 'react';
import { ArrowRight, MousePointer2 } from 'lucide-react';
import { EditorialSection, Reveal, cx } from '@/design-system';
import { HealthBadge } from '@/app/features/projectUi';
import { PHOTOS } from './images';

/** A small floating tag over a photo, like a note pinned to the work. Decorative framing for real content. */
function Tag({ className, children }: { className: string; children: ReactNode }) {
  return <div className={cx('absolute rounded-md bg-core-chip px-3 py-2 text-xs leading-snug text-core-ink', className)}>{children}</div>;
}

/** A name tag with a small cursor, as in a shared canvas. */
function Cursor({ className, name }: { className: string; name: string }) {
  return (
    <div className={cx('absolute flex items-start gap-1', className)}>
      <MousePointer2 aria-hidden="true" className="size-4 fill-core-ink text-core-ink" />
      <span className="mt-3 rounded-md bg-core-chip px-2.5 py-1 text-xs text-core-muted">{name}</span>
    </div>
  );
}

function Photo({ photo, position }: { photo: { src: string }; position: string }) {
  return <img src={photo.src} alt="" decoding="async" className={cx('size-full rounded-md object-cover', position)} />;
}

/** One column: a gray card with a photo and tags on top, then a centered serif title and text. */
function Column({ title, text, delay, visual }: { title: string; text: string; delay: number; visual: ReactNode }) {
  return (
    <Reveal as="li" delay={delay} className="w-[78%] shrink-0 snap-center md:w-auto md:min-w-0">
      <div className="flex h-full flex-col rounded-xl bg-core-card px-6 pt-10 pb-10 text-center">
        <div className="relative mx-auto aspect-square w-[68%]">{visual}</div>
        <h3 className="mt-14 font-display text-3xl leading-tight font-normal tracking-[-0.014em]">{title}</h3>
        <p className="mx-auto mt-4 max-w-xs text-md leading-6 text-core-ink">{text}</p>
      </div>
    </Reveal>
  );
}

export function Solution() {
  return (
    <EditorialSection
      id="solution"
      label="The solution"
      align="center"
      title="Every stage, one clear view"
      lede="See which projects need you, why they are flagged, and what to tell the homeowner, from one connected workspace."
    >
      <div role="region" aria-label="Solution highlights. Swipe sideways to see all three." tabIndex={0} className="-mx-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:overflow-visible md:px-0">
        <ul className="flex snap-x snap-mandatory gap-3 md:grid md:grid-cols-3 md:gap-4 lg:gap-6">
          <Column
            title="Rank by need"
            text="The home screen is a ranked list, not a dashboard of charts."
            delay={0}
            visual={
              <>
                <Photo photo={PHOTOS.coordinator} position="object-[40%_50%]" />
                <Tag className="top-6 -left-4 lg:-left-10">Needs you today</Tag>
                <Tag className="right-[-2.5rem] -bottom-4 hidden items-center gap-2 py-2.5 lg:flex">
                  <span>Maria Delgado</span>
                  <HealthBadge health="blocked" size="sm" />
                </Tag>
                <Cursor className="top-[45%] -left-12 hidden lg:flex" name="Dana" />
              </>
            }
          />

          <Column
            title="Status in words"
            text="Every flag carries its reason, never just a color."
            delay={0.1}
            visual={
              <>
                <Photo photo={PHOTOS.installers} position="object-[65%_50%]" />
                <Tag className="top-8 -left-4 lg:-left-10 max-w-40 space-y-1.5 py-2.5">
                  <HealthBadge health="blocked" size="sm" />
                  <p>City asked for a structural letter.</p>
                </Tag>
                <Tag className="right-[-2.5rem] bottom-6 hidden max-w-40 space-y-1.5 py-2.5 lg:block">
                  <HealthBadge health="at-risk" size="sm" />
                  <p>Permitting is 3 days over target.</p>
                </Tag>
              </>
            }
          />

          <Column
            title="Plain updates"
            text="Homeowners read their own words, not ours."
            delay={0.2}
            visual={
              <>
                <Photo photo={PHOTOS.homeowner} position="object-[30%_50%]" />
                <Tag className="top-8 -left-4 lg:-left-10 flex items-center gap-2">
                  <span className="font-mono text-warning-fg">AHJ</span>
                  <ArrowRight aria-hidden="true" className="size-3 text-core-muted" />
                  <span>city permit office</span>
                </Tag>
                <Tag className="right-[-2.5rem] bottom-8 hidden items-center gap-2 lg:flex">
                  <span className="font-mono text-warning-fg">PTO</span>
                  <ArrowRight aria-hidden="true" className="size-3 text-core-muted" />
                  <span>approval to turn on</span>
                </Tag>
                <Cursor className="-right-6 top-1/3 hidden lg:flex" name="Maria" />
              </>
            }
          />
        </ul>
      </div>
    </EditorialSection>
  );
}
