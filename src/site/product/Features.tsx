import { useId, useState } from 'react';
import { ArrowDown, ArrowUpRight, OctagonAlert } from 'lucide-react';
import { Avatar, Button, CardStack, ChatBubble, Checkbox, Panel, Reveal, SectionTag, Stepper, buttonStyles, type Step } from '@/design-system';
import { HealthBadge } from '@/app/features/projectUi';

const CHECKS = ['Structural letter received', 'Plans approved by the city', 'Utility application filed'];

function GuardrailDemo() {
  const [done, setDone] = useState<boolean[]>([true, true, false]);
  const reasonId = useId();
  const missing = CHECKS.filter((_, i) => !done[i]);
  return (
    <div className="mt-8">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">Permitting checklist</legend>
        <div className="space-y-3">
          {CHECKS.map((c, i) => (
            <Checkbox key={c} label={c} strikeWhenChecked checked={done[i]} onChange={(e) => setDone((d) => d.map((v, j) => (j === i ? e.target.checked : v)))} />
          ))}
        </div>
      </fieldset>
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line-default pt-4">
        <Button variant="primary" disabled={missing.length > 0} aria-describedby={reasonId} trailingIcon={<ArrowUpRight />}>
          Move to Installation
        </Button>
        <p id={reasonId} className="text-sm text-ink-secondary">
          {missing.length > 0 ? `Needs: ${missing.join(', ').toLowerCase()}.` : 'Everything required is done.'}
        </p>
      </div>
    </div>
  );
}

const stages: Step[] = [
  { id: 'c', label: 'Contract', status: 'complete' },
  { id: 's', label: 'Survey', status: 'complete' },
  { id: 'd', label: 'Design', status: 'complete' },
  { id: 'p', label: 'Permit', status: 'blocked' },
  { id: 'i', label: 'Install', status: 'upcoming' },
];

function Term({ children }: { children: string }) {
  return <span className="rounded-md bg-warning-bg px-1 font-medium text-warning-fg">{children}</span>;
}

export function Features() {
  const headingId = useId();
  return (
    <section id="features" aria-labelledby={headingId} className="scroll-mt-16">
      <h2 id={headingId} className="sr-only">
        Features
      </h2>
      <div className="mx-auto grid max-w-7xl gap-3 px-4 py-4 sm:px-10 md:grid-cols-2 md:py-6">
        <Reveal>
          <Panel padding="lg" className="h-full">
            <SectionTag label="Checklists" />
            <h3 className="mt-8 max-w-sm text-3xl leading-[1.05] font-display font-normal tracking-[-0.014em] md:text-4xl">Guardrails, not warnings.</h3>
            <p className="mt-3 max-w-sm text-base text-ink-secondary">A project only moves forward when its checklist is done. Try it: check the last item.</p>
            <GuardrailDemo />
          </Panel>
        </Reveal>

        <Reveal delay={0.06}>
          <Panel tone="wash" padding="lg" className="h-full">
            <SectionTag label="Messages" />
            <h3 className="mt-8 max-w-sm text-3xl leading-[1.05] font-display font-normal tracking-[-0.014em] md:text-4xl">Plain words, ready to send.</h3>
            <p className="mt-3 max-w-sm text-base text-ink-secondary">Drafts use the homeowner’s name for each stage, and a jargon check runs before anything goes out.</p>
            <div className="mt-8 flex flex-col gap-3 rounded-3xl bg-paper-raised p-5 shadow-float sm:p-6">
              <p className="text-sm text-ink-tertiary">Your draft</p>
              <ChatBubble from="team">
                The <Term>AHJ</Term> approved the <Term>plan set</Term>. Next is install, then <Term>PTO</Term>.
              </ChatBubble>
              <p className="flex items-center gap-2 self-end pt-1 text-sm text-ink-tertiary">
                <ArrowDown aria-hidden="true" className="size-4" /> What Maria reads
              </p>
              <ChatBubble from="homeowner">The city approved your system plans. Next we install, then we get approval to turn on your system.</ChatBubble>
            </div>
          </Panel>
        </Reveal>

        <Reveal delay={0.08} className="md:col-span-2">
          <Panel tone="dark" padding="none" className="h-full">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="flex flex-col justify-between gap-8 p-6 sm:gap-10 sm:p-12">
                <div>
                  <SectionTag label="System" ink />
                  <h3 className="mt-8 max-w-lg text-3xl leading-[1] font-display font-normal tracking-[-0.014em] sm:text-4xl md:text-heading">One system for every stage</h3>
                  <p className="mt-6 max-w-sm text-md leading-snug text-ink-inverse-secondary">Stages, blockers, checklists and homeowner updates share one set of rules, in the app and in the design system behind it.</p>
                </div>
                <a href="/storybook/" className={`${buttonStyles({ variant: 'secondary', size: 'md', press: true })} self-start`}>
                  Explore the components <ArrowUpRight aria-hidden="true" />
                </a>
              </div>
              <div className="flex items-center justify-center px-4 pb-8 sm:px-12 lg:py-12 lg:pl-0">
                <CardStack className="w-full max-w-md">
                  <div>
                    <div className="flex items-center gap-3">
                      <Avatar name="Maria Delgado" size="lg" decorative />
                      <div className="min-w-0 flex-1">
                        <p className="text-md font-semibold tracking-tight">Maria Delgado</p>
                        <p className="text-sm text-ink-tertiary">Permitting · 26d of 21d target</p>
                      </div>
                      <HealthBadge health="blocked" size="sm" />
                    </div>
                    <div className="mt-4">
                      <Stepper steps={stages} label="Project stages" variant="compact" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-danger-bg text-danger-fg">
                      <OctagonAlert aria-hidden="true" className="size-5" />
                    </span>
                    <p className="text-sm leading-snug">
                      <span className="block font-semibold">City requested a structural letter</span>
                      <span className="text-ink-secondary">Waiting on the engineer · open 6 days</span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-ink-tertiary">What Maria sees</p>
                    <ChatBubble from="homeowner">The city has asked us for more information before approving your plans.</ChatBubble>
                  </div>
                </CardStack>
              </div>
            </div>
          </Panel>
        </Reveal>
      </div>
    </section>
  );
}
