import { useMemo, useState, type ReactNode } from 'react';
import { ArrowRight, Boxes, FileCode2, Inbox, LayoutList, MessageSquareText, OctagonAlert, ShieldCheck, Workflow } from 'lucide-react';
import { Badge, Button, Field, Stepper, Textarea, buttonStyles, cx, tokens, type Step } from '@/design-system';
import { Link } from '@/app/router';
import { Logo } from '@/app/layout/Logo';
import { HealthBadge } from '@/app/features/projectUi';
import { findJargon, replaceJargon } from '@/app/domain/plainLanguage';

const DISCLAIMER = 'Independent Speculative Concept — Not Affiliated with Artemis.';

type Evidence = 'verified' | 'observation' | 'interpretation' | 'assumption';
const EVIDENCE: Record<Evidence, { label: string; tone: 'success' | 'info' | 'accent' | 'warning' }> = {
  verified: { label: 'Verified fact', tone: 'success' },
  observation: { label: 'Observation', tone: 'info' },
  interpretation: { label: 'Interpretation', tone: 'accent' },
  assumption: { label: 'Assumption', tone: 'warning' },
};

function Tag({ kind }: { kind: Evidence }) {
  return (
    <Badge tone={EVIDENCE[kind].tone} size="sm">
      {EVIDENCE[kind].label}
    </Badge>
  );
}

const heroSteps: Step[] = [
  { id: 'c', label: 'Contract', status: 'complete', meta: 'Done' },
  { id: 's', label: 'Site survey', status: 'complete', meta: 'Done' },
  { id: 'd', label: 'Final design', status: 'complete', meta: 'Done' },
  { id: 'p', label: 'Permitting', status: 'blocked', meta: '26d · target 21d' },
  { id: 'i', label: 'Installation', status: 'upcoming' },
  { id: 'n', label: 'Inspection', status: 'upcoming' },
  { id: 'o', label: 'PTO', status: 'upcoming' },
];

function Section({ n, title, kicker, children, id }: { n: string; title: ReactNode; kicker?: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} aria-labelledby={`s-${n}`} className="grid gap-6 border-t border-line-default py-14 sm:py-20 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <p className="font-mono text-xs text-ember-600">{n}</p>
        {kicker && <p className="mt-1 text-sm text-ink-tertiary">{kicker}</p>}
      </div>
      <div className="min-w-0">
        <h2 id={`s-${n}`} className="max-w-3xl font-serif text-3xl leading-[1.1] tracking-[-0.01em] text-balance sm:text-4xl">
          {title}
        </h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

export function PresentationPage() {
  return (
    <div className="min-h-dvh bg-paper-base">
      <a href="#content" className="fixed top-2 left-2 z-[70] -translate-y-20 rounded-md bg-paper-inverse px-3 py-2 text-sm font-medium text-ink-inverse focus:translate-y-0">
        Skip to content
      </a>
      <header className="sticky top-0 z-30 border-b border-line-subtle bg-paper-base/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-8">
          <Logo />
          <span className="hidden text-xs text-ink-tertiary md:inline">{DISCLAIMER}</span>
          <Link to="/app" className={cx(buttonStyles({ variant: 'primary', size: 'sm' }), 'ml-auto')}>
            Open prototype <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </header>

      <main id="content" className="mx-auto max-w-6xl px-4 sm:px-8">
        {/* Hero */}
        <section aria-labelledby="hero-title" className="pt-14 pb-16 sm:pt-24 sm:pb-24">
          <p role="note" className="inline-flex items-center gap-2 rounded-full border border-line-default bg-paper-raised px-3 py-1 text-xs font-medium text-ink-secondary shadow-xs">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-ember-600" />
            {DISCLAIMER}
          </p>
          <h1 id="hero-title" className="mt-6 max-w-4xl animate-rise font-serif text-[2.75rem] leading-[1.02] tracking-[-0.02em] text-balance sm:text-5xl">
            The long, quiet months between <em className="text-ember-600">signed</em> and <em className="text-ember-600">switched on</em>.
          </h1>
          <p className="mt-6 max-w-2xl text-md leading-relaxed text-ink-secondary sm:text-lg">
            Groundwork is a speculative product concept for the people who carry a home-energy project from signed contract to permission to
            operate — and for the homeowners waiting on them. An independent exploration of how product design and design engineering come
            together to create thoughtful, functional software.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/app" className={buttonStyles({ variant: 'primary', size: 'lg' })}>
              Open the working prototype <ArrowRight aria-hidden="true" />
            </Link>
            <a href="#case-study" className={buttonStyles({ variant: 'secondary', size: 'lg' })}>
              Read the case study
            </a>
          </div>
          <dl className="mt-12 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-5 text-sm sm:grid-cols-4">
            {[
              ['Role', 'Product design + design engineering'],
              ['Type', 'Independent, self-initiated'],
              ['Stack', 'React 19 · TypeScript · Tailwind v4'],
              ['Docs', 'Storybook 9 · AGENTS.md'],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-ink-tertiary">{k}</dt>
                <dd className="mt-1 font-medium text-ink-primary">{v}</dd>
              </div>
            ))}
          </dl>

          {/* Live composition: real components, not a screenshot */}
          <figure className="mt-16">
            <div className="rounded-xl border border-line-default bg-paper-raised p-4 shadow-lg sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold tracking-tight">Maria Delgado</p>
                  <p className="text-sm text-ink-tertiary">1482 Larkspur Lane, Riverside · Solar + battery, 8.4 kW</p>
                </div>
                <HealthBadge health="blocked" />
              </div>
              <div className="mt-8">
                <Stepper steps={heroSteps} label="Example project stages" />
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-danger-line bg-danger-bg/50 p-4 text-sm">
                  <p className="flex items-center gap-2 font-semibold text-danger-fg">
                    <OctagonAlert aria-hidden="true" className="size-4" /> City requested a structural letter
                  </p>
                  <p className="mt-1 text-ink-secondary">Waiting on structural engineer · open 6d</p>
                </div>
                <div className="rounded-lg border border-line-default bg-paper-base p-4 text-sm">
                  <p className="flex items-center gap-2 font-semibold">
                    <MessageSquareText aria-hidden="true" className="size-4 text-ink-tertiary" /> What Maria sees
                  </p>
                  <p className="mt-1 text-ink-secondary">“The city has asked us for more information before approving your plans.”</p>
                </div>
              </div>
            </div>
            <figcaption className="mt-3 text-xs text-ink-tertiary">Rendered live with the product’s own components and tokens. Fictional, illustrative data.</figcaption>
          </figure>
        </section>

        <div id="case-study" />

        <Section n="01" kicker="Context & research" title="Sales tools get a home-energy project signed. Then a different, slower job begins.">
          <div className="grid gap-4 md:grid-cols-2">
            <ResearchCard kind="verified" source="artemispower.com">
              Artemis presents an all-in-one platform for residential solar and roofing teams, covering AI design, proposals, financing and sales.
              Its site names four audiences: Designers, Sales, Operations and Owners.
            </ResearchCard>
            <ResearchCard kind="verified" source="artemispower.com/solutions">
              The Operations audience is described as tracking every project “from sale to PTO” (permission to operate).
            </ResearchCard>
            <ResearchCard kind="observation" source="Public site review">
              The public story concentrates on design speed and closing the sale. The post-sale journey is mentioned, but most of the detail is
              about the sales half.
            </ResearchCard>
            <ResearchCard kind="interpretation">
              After signing, project time is spent waiting on others: city permit offices, utilities, lenders and suppliers. The work becomes
              coordination, and the homeowner often can’t see progress.
            </ResearchCard>
          </div>
          <p className="mt-6 max-w-2xl text-sm text-ink-tertiary">
            Research used only public pages: the company site, its pricing page and the Design Engineer job posting. No internal information,
            interviews or user data were used. Full sources are in <code className="font-mono text-xs">docs/company-research.md</code>.
          </p>
        </Section>

        <Section n="02" kicker="Problem" title="Coordinators juggle dozens of stalled projects, and homeowners hear nothing until they call.">
          <div className="grid gap-8 md:grid-cols-2">
            <ProblemList
              title="For the project coordinator"
              items={[
                'Status lives in spreadsheets, inboxes and memory.',
                'Every project looks equally urgent, so the stalled ones hide.',
                '“Can we move this forward?” depends on rules nobody wrote down.',
              ]}
            />
            <ProblemList
              title="For the homeowner"
              items={[
                'Long silences between signing and switching on.',
                'Updates full of jargon: AHJ, interconnection, PTO.',
                'They call the office to ask “where is my project?”',
              ]}
            />
          </div>
          <blockquote className="mt-10 border-l-2 border-ember-600 pl-5 font-serif text-2xl leading-snug text-ink-primary">
            How might we help a coordinator see which projects need them today, and keep each homeowner informed in words they understand?
          </blockquote>
          <p className="mt-4 flex items-center gap-2 text-xs text-ink-tertiary">
            <Tag kind="assumption" /> Problem framing is based on public information and reasoning, not on user research. It should be validated with
            real coordinators.
          </p>
        </Section>

        <Section n="03" kicker="Product strategy" title="Four principles, each with a working feature behind it.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Principle icon={<Inbox />} title="Rank, don’t list" feature="Today queue">
              The home screen is not a dashboard of charts. It is a ranked list of the coordinator’s projects that need action, with the reason for
              each.
            </Principle>
            <Principle icon={<LayoutList />} title="Status in words, not just color" feature="Health engine">
              Health is calculated from blockers, stage targets and homeowner silence. It always shows the reasons in plain text.
            </Principle>
            <Principle icon={<ShieldCheck />} title="Guardrails, not warnings" feature="Stage checklist">
              A project can only move forward when the required checklist items are done and blockers are resolved. The button says why it is
              disabled.
            </Principle>
            <Principle icon={<MessageSquareText />} title="Translate for the homeowner" feature="Update composer">
              Every stage has a homeowner name and explanation. Drafts use them, and a plain-language check flags jargon before anything is sent.
            </Principle>
          </div>
        </Section>

        <Section n="04" kicker="Core journey" title="One coordinator, one morning, one stalled permit.">
          <ol className="grid gap-px overflow-hidden rounded-lg border border-line-default bg-line-default md:grid-cols-5">
            {[
              ['Today', 'Maria’s project is first in the queue: blocked 6 days, 5 days over target.'],
              ['Project', 'The stepper and alert explain where it is stuck and why.'],
              ['Resolve', 'The engineer letter arrives. The blocker is resolved with a note, with Undo.'],
              ['Advance', 'The last checklist item is checked. “Move to Installation” unlocks.'],
              ['Notify', 'One checkbox sends Maria a plain-language update about the next step.'],
            ].map(([t, d], i) => (
              <li key={t} className="bg-paper-raised p-5">
                <p className="font-mono text-xs text-ember-600">0{i + 1}</p>
                <p className="mt-2 font-semibold">{t}</p>
                <p className="mt-1 text-sm text-ink-secondary">{d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-6">
            <Link to="/app" className={buttonStyles({ variant: 'secondary' })}>
              Try this journey in the prototype <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </Section>

        <Section n="05" kicker="Interaction example" title="Try the plain-language check.">
          <JargonDemo />
        </Section>

        <Section n="06" kicker="Design system" title="A small system, built from first principles and owned end to end.">
          <TokenShowcase />
        </Section>

        <Section n="07" kicker="Design engineering" title="Design decisions live in one place and travel to code, Storybook and AI tools.">
          <Pipeline />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <EngCard icon={<FileCode2 />} title="Tokens as data">
              <code className="font-mono text-xs">tokens.json</code> (DTCG format) generates Tailwind’s theme and typed TS. The build fails if the
              generated files drift.
            </EngCard>
            <EngCard icon={<Boxes />} title="25+ components, zero UI kits">
              Every component is written from scratch: Select, Menu, Dialog, Tabs, Tooltip, Toast, Table and more, with ARIA patterns and
              keyboard support.
            </EngCard>
            <EngCard icon={<Workflow />} title="Readable by people and AI">
              <code className="font-mono text-xs">AGENTS.md</code>, a machine-readable component manifest, Storybook docs and an ESLint rule keep
              humans and AI agents on-system.
            </EngCard>
          </div>
        </Section>

        <Section n="08" kicker="Responsive & accessible" title="Designed for a desk in the office and a phone in a truck.">
          <ul className="grid gap-x-10 gap-y-3 text-sm text-ink-secondary sm:grid-cols-2">
            {[
              'Sidebar → drawer below 1024px; table → cards below 768px.',
              'Dialogs become bottom sheets on phones.',
              'Touch targets grow to 44px on coarse pointers.',
              'Keyboard support for every control, with visible focus.',
              'WAI-ARIA patterns: combobox, menu, tabs, dialog, switch.',
              'Status always has text, never color alone.',
              'Text contrast checked against WCAG AA in the token file.',
              'Motion respects prefers-reduced-motion.',
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-ember-600" />
                {t}
              </li>
            ))}
          </ul>
        </Section>

        <Section n="09" kicker="Trade-offs & next" title="What this prototype is, and what it is not.">
          <div className="grid gap-8 md:grid-cols-2">
            <ProblemList
              title="Deliberate trade-offs"
              items={[
                'No backend: state is local and persisted in the browser. Sending is simulated.',
                'Stage targets (SLA days) are illustrative defaults, not industry benchmarks.',
                'Light theme only, to spend the time on workflows and accessibility first.',
                'No Figma file exists yet. The token file is structured to map onto Figma variables.',
              ]}
            />
            <ProblemList
              title="Next steps"
              items={[
                'Interview coordinators to validate the problem and the health rules.',
                'Homeowner-facing status page using the same stage language.',
                'Build the Figma library from tokens.json and keep it in sync.',
                'Visual regression and accessibility checks in CI for every story.',
              ]}
            />
          </div>
        </Section>
      </main>

      <footer className="border-t border-line-default bg-paper-sunken/50">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-ink-tertiary sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            <span className="font-medium text-ink-secondary">{DISCLAIMER}</span> All people, companies, addresses and numbers in the prototype are
            fictional.
          </p>
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <span>Designed and built by [Your Name]</span>
            <a href="https://github.com/Gayanekh/groundwork" className="font-medium text-ember-600 hover:text-ember-700">
              View source on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

function ResearchCard({ kind, source, children }: { kind: Evidence; source?: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-line-default bg-paper-raised p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Tag kind={kind} />
        {source && <span className="font-mono text-2xs text-ink-tertiary">{source}</span>}
      </div>
      <p className="mt-3 text-base leading-relaxed text-ink-secondary">{children}</p>
    </div>
  );
}

function ProblemList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2.5">
        {items.map((t) => (
          <li key={t} className="flex gap-3 text-base text-ink-secondary">
            <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-ink-tertiary" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Principle({ icon, title, feature, children }: { icon: ReactNode; title: string; feature: string; children: ReactNode }) {
  return (
    <div className="flex flex-col rounded-lg border border-line-default bg-paper-raised p-5">
      <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-md bg-ember-50 text-ember-700 [&_svg]:size-[18px]">
        {icon}
      </span>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-ink-secondary">{children}</p>
      <p className="mt-4 text-xs text-ink-tertiary">
        Built as: <span className="font-medium text-ink-secondary">{feature}</span>
      </p>
    </div>
  );
}

function EngCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-line-default bg-paper-raised p-5">
      <span aria-hidden="true" className="text-ink-secondary [&_svg]:size-5">
        {icon}
      </span>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-secondary">{children}</p>
    </div>
  );
}

const SAMPLE = 'Hi Maria, the AHJ approved your plan set! Next we schedule install, then inspection, then we apply for PTO with the utility.';

function JargonDemo() {
  const [text, setText] = useState(SAMPLE);
  const hits = useMemo(() => findJargon(text), [text]);
  const unique = Array.from(new Map(hits.map((h) => [h.term.toLowerCase(), h])).values());
  return (
    <div className="grid gap-6 rounded-xl border border-line-default bg-paper-raised p-5 shadow-sm sm:p-8 md:grid-cols-2">
      <div>
        <Field label="Message to a homeowner" hint="Edit it, or replace the flagged terms.">
          <Textarea rows={5} value={text} onChange={(e) => setText(e.target.value)} />
        </Field>
        <Button variant="ghost" size="sm" className="mt-2" onClick={() => setText(SAMPLE)}>
          Reset example
        </Button>
      </div>
      <div aria-live="polite">
        <p className="text-sm font-semibold">
          {unique.length === 0 ? 'Clear — no jargon found.' : `${unique.length} term${unique.length === 1 ? '' : 's'} a homeowner may not know`}
        </p>
        <ul className="mt-3 space-y-2">
          {unique.map((h) => (
            <li key={h.term} className="flex items-center gap-3 rounded-md border border-line-subtle bg-paper-base px-3 py-2 text-sm">
              <span className="min-w-0 flex-1">
                <span className="font-mono text-xs text-warning-fg">{h.match}</span> → {h.plain}
              </span>
              <Button size="sm" variant="secondary" onClick={() => setText((t) => replaceJargon(t, h.term, h.plain))} aria-label={`Replace ${h.match}`}>
                Replace
              </Button>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-ink-tertiary">Same domain function the product uses (src/app/domain/plainLanguage.ts), unit-tested.</p>
      </div>
    </div>
  );
}

function TokenShowcase() {
  const swatches: Array<[string, string]> = [
    ['paper.base', tokens['color.paper.base']],
    ['paper.raised', tokens['color.paper.raised']],
    ['paper.inverse', tokens['color.paper.inverse']],
    ['ink.secondary', tokens['color.ink.secondary']],
    ['ember.600', tokens['color.ember.600']],
    ['ember.400', tokens['color.ember.400']],
    ['success.fg', tokens['color.success.fg']],
    ['warning.fg', tokens['color.warning.fg']],
    ['danger.fg', tokens['color.danger.fg']],
    ['info.fg', tokens['color.info.fg']],
  ];
  return (
    <div className="space-y-10">
      <div>
        <h3 className="text-sm font-semibold">Color — warm paper, quiet ink, one ember accent</h3>
        <p className="mt-1 max-w-2xl text-sm text-ink-secondary">
          Ops tools are used all day, so the canvas is a warm off-white instead of pure white. Color is kept for meaning: one accent for focus
          and progress, and four status colors. Tailwind’s default palette is turned off, so only these tokens exist.
        </p>
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {swatches.map(([name, hex]) => (
            <li key={name} className="overflow-hidden rounded-md border border-line-default bg-paper-raised">
              <span aria-hidden="true" className="block h-14 border-b border-line-subtle" style={{ background: hex }} />
              <span className="block px-2.5 py-2">
                <span className="block font-mono text-2xs text-ink-primary">{name}</span>
                <span className="block font-mono text-2xs text-ink-tertiary uppercase">{hex}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold">Type — Instrument Sans for work, Instrument Serif for story</h3>
          <div className="mt-4 space-y-3 rounded-lg border border-line-default bg-paper-raised p-5">
            <p className="font-serif text-3xl leading-none">Approval to turn on</p>
            <p className="text-2xl font-semibold tracking-tight">Projects</p>
            <p className="text-md font-semibold">Permitting checklist</p>
            <p className="text-base text-ink-secondary">Required items must be done first.</p>
            <p className="font-mono text-xs text-ink-tertiary">GW-1048 · 26d / 21d</p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Components — states, not just variants</h3>
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-line-default bg-paper-raised p-5">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" loading>
              Saving
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
            <HealthBadge health="on-track" />
            <HealthBadge health="at-risk" />
            <HealthBadge health="blocked" />
          </div>
          <p className="mt-3 text-xs text-ink-tertiary">
            Full inventory with every state: run <code className="font-mono">npm run storybook</code>.
          </p>
        </div>
      </div>
    </div>
  );
}

function Pipeline() {
  const nodes = [
    { t: 'tokens.json', d: 'Source of truth (DTCG)' },
    { t: 'build-tokens', d: 'Generates + --check in CI' },
    { t: 'tokens.css / .ts', d: 'Tailwind @theme + typed JS' },
    { t: 'Components', d: 'React + TS, from scratch' },
  ];
  const outs = ['App', 'Storybook', 'AGENTS.md + manifest', 'Figma variables (planned)'];
  return (
    <div className="rounded-xl border border-line-default bg-paper-raised p-5 sm:p-8">
      <ol className="grid gap-3 md:grid-cols-4">
        {nodes.map((n, i) => (
          <li key={n.t} className="relative rounded-md border border-line-default bg-paper-base p-4">
            <p className="font-mono text-xs font-medium">{n.t}</p>
            <p className="mt-1 text-xs text-ink-tertiary">{n.d}</p>
            {i < nodes.length - 1 && (
              <ArrowRight aria-hidden="true" className="absolute top-1/2 -right-3 z-10 hidden size-4 -translate-y-1/2 rounded-full bg-paper-raised text-ink-tertiary md:block" />
            )}
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-ink-tertiary">Consumed by</span>
        {outs.map((o) => (
          <span key={o} className={cx('rounded-full border px-2.5 py-1', o.includes('planned') ? 'border-dashed border-line-strong text-ink-tertiary' : 'border-line-default text-ink-secondary')}>
            {o}
          </span>
        ))}
      </div>
    </div>
  );
}
