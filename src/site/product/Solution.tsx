import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { EditorialSection, Panel, Reveal } from '@/design-system';
import { HealthBadge } from '@/app/features/projectUi';
import { LogoMark } from '@/app/layout/Logo';
import type { Health } from '@/app/domain/types';

function Column({ title, text, delay, children }: { title: string; text: string; delay: number; children: ReactNode }) {
  return (
    <Reveal as="li" delay={delay} className="w-[78%] shrink-0 snap-center md:w-auto md:min-w-0">
      {children}
      <h3 className="mt-5 text-center text-lg font-medium tracking-tight">{title}</h3>
      <p className="mx-auto mt-1 max-w-xs text-center text-base text-ink-secondary">{text}</p>
    </Reveal>
  );
}

const reasons: Array<{ health: Health; why: string }> = [
  { health: 'blocked', why: 'City asked for a structural letter.' },
  { health: 'at-risk', why: 'Permitting is 3 days over target.' },
  { health: 'on-track', why: 'Inside the stage target.' },
];

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
        <Column title="Rank by need" text="The home screen is a ranked list, not a dashboard of charts." delay={0}>
          <Panel tone="dark" padding="md" className="flex aspect-4/5 flex-col justify-between">
            <div>
              <p className="text-2xs text-ink-inverse-tertiary uppercase">Needs you today</p>
              <p className="mt-2 text-2xl leading-snug font-medium tracking-tight">3 projects, ranked by what is stuck.</p>
            </div>
            <div className="border-t border-line-inverse pt-4">
              <p className="text-2xs text-ink-inverse-tertiary uppercase">First in the queue</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="text-lg font-semibold tracking-tight">Maria Delgado</p>
                <HealthBadge health="blocked" size="sm" shape="pill" />
              </div>
              <p className="mt-1 text-sm text-ink-inverse-secondary">Blocked 6 days in Permitting.</p>
            </div>
            <p className="flex items-center justify-between border-t border-line-inverse pt-4 text-sm text-ink-inverse-secondary">
              Open the project <ArrowRight aria-hidden="true" className="size-4" />
            </p>
          </Panel>
        </Column>

        <Column title="Status in words" text="Every flag carries its reason, never just a color." delay={0.1}>
          <Panel tone="wash" padding="md" className="flex aspect-4/5 flex-col justify-end gap-3">
            {reasons.map((r, n) => (
              <div key={r.health} className="rounded-2xl bg-paper-raised/95 p-4 shadow-float" style={{ marginInline: `${n * 6}px` }}>
                <HealthBadge health={r.health} size="sm" shape="pill" />
                <p className="mt-2 text-base font-medium tracking-tight">{r.why}</p>
              </div>
            ))}
          </Panel>
        </Column>

        <Column title="Plain updates" text="Homeowners read their own words, not ours." delay={0.2}>
          <Panel tone="light" padding="md" className="flex aspect-4/5 flex-col items-center justify-center gap-6 bg-linear-to-b from-wash-cloud to-paper-raised">
            <span className="grid size-36 place-items-center rounded-3xl bg-paper-inverse shadow-float">
              <LogoMark className="size-20" />
            </span>
            <div className="w-full space-y-2 text-sm">
              {[
                ['AHJ', 'city permit office'],
                ['PTO', 'approval to turn on'],
              ].map(([a, b]) => (
                <p key={a} className="flex items-center justify-between gap-2 rounded-full border border-line-default bg-paper-raised px-4 py-2">
                  <span className="font-mono text-xs text-warning-fg">{a}</span>
                  <ArrowRight aria-hidden="true" className="size-3.5 text-ink-tertiary" />
                  <span>{b}</span>
                </p>
              ))}
            </div>
          </Panel>
        </Column>
      </ul>
      </div>
    </EditorialSection>
  );
}
