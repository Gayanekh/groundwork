import { useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  CircleCheck,
  Clock3,
  Copy,
  FileWarning,
  History,
  Mail,
  MessageSquareText,
  MoreHorizontal,
  OctagonAlert,
  Phone,
  Plus,
  Send,
} from 'lucide-react';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  Checkbox,
  EmptyState,
  IconButton,
  Menu,
  MenuItem,
  MenuSeparator,
  ProgressBar,
  Skeleton,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Tooltip,
  buttonStyles,
  cx,
  useToast,
} from '@/design-system';
import { Link, navigate, useLocation } from '../router';
import { useProjects } from '../state/ProjectsStore';
import { advanceBlockedReason, daysBetween, getHealth, isComplete, openBlockers, stageChecklist } from '../domain/health';
import { BLOCKER_CATEGORY, STAGES, STAGE_BY_ID, TRADE_LABEL, nextStage } from '../domain/stages';
import { formatDate, formatDateTime, relativeDays } from '../domain/format';
import { HealthBadge, ProjectStepper } from '../features/projectUi';
import { AddBlockerDialog, ResolveBlockerDialog } from '../features/BlockerDialogs';
import { AdvanceStageDialog } from '../features/AdvanceStageDialog';
import { UpdateComposer } from '../features/UpdateComposer';
import type { ActivityKind, Blocker, Project } from '../domain/types';

type TabId = 'overview' | 'blockers' | 'updates' | 'activity';

export function ProjectDetailPage({ id }: { id: string }) {
  const { getProject, loading } = useProjects();
  const project = getProject(id);

  if (loading) return <DetailSkeleton />;
  if (!project) {
    return (
      <EmptyState
        variant="page"
        icon={<FileWarning />}
        titleAs="h1"
        title="Project not found"
        action={
          <Link to="/app/projects" className={buttonStyles({ variant: 'primary' })}>
            Back to projects
          </Link>
        }
      >
        There is no project with ID “{id}”. It may have been removed when the demo data was reset.
      </EmptyState>
    );
  }
  return <ProjectDetail project={project} />;
}

function ProjectDetail({ project: p }: { project: Project }) {
  const { search, pathname } = useLocation();
  const toast = useToast();
  const tab = (search.get('tab') ?? 'overview') as TabId;
  const setTab = (t: string) => navigate(t === 'overview' ? pathname : `${pathname}?tab=${t}`, { replace: true });

  const [advanceOpen, setAdvanceOpen] = useState(false);
  const [addBlockerOpen, setAddBlockerOpen] = useState(false);
  const [resolving, setResolving] = useState<Blocker | null>(null);

  const h = getHealth(p);
  const open = openBlockers(p);
  const stage = STAGE_BY_ID[p.stage];
  const next = nextStage(p.stage);
  const blockedReason = advanceBlockedReason(p);
  const complete = isComplete(p);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(p.id);
      toast({ title: `Copied ${p.id}`, tone: 'info', duration: 2500 });
    } catch {
      toast({ title: 'Couldn’t copy', description: 'Your browser blocked clipboard access.', tone: 'danger' });
    }
  };

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb">
        <Link to="/app/projects" className="inline-flex items-center gap-1 rounded-sm text-sm font-medium text-ink-tertiary hover:text-ink-primary">
          <ChevronLeft aria-hidden="true" className="size-4" /> Projects
        </Link>
      </nav>

      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{p.homeowner.name}</h1>
            <HealthBadge health={h.health} />
          </div>
          <p className="mt-1.5 text-base text-ink-secondary">
            {p.address.street}, {p.address.city}, {p.address.state} {p.address.zip}
          </p>
          <p className="mt-1 flex flex-wrap gap-x-2 text-sm text-ink-tertiary">
            <span className="font-mono">{p.id}</span>
            <span aria-hidden="true">·</span>
            <span>
              {TRADE_LABEL[p.trade]}
              {p.systemKw ? `, ${p.systemKw} kW` : ''}
            </span>
            <span aria-hidden="true">·</span>
            <span>Signed {formatDate(p.createdAt)}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" leadingIcon={<Send />} onClick={() => setTab('updates')} className="max-sm:flex-1">
            Update homeowner
          </Button>
          <Menu
            trigger={<IconButton aria-label="More actions" variant="secondary" icon={<MoreHorizontal />} />}
          >
            <MenuItem icon={<Plus />} onSelect={() => setAddBlockerOpen(true)}>
              Add blocker
            </MenuItem>
            <MenuItem icon={<History />} onSelect={() => setTab('activity')}>
              View activity
            </MenuItem>
            <MenuSeparator />
            <MenuItem icon={<Copy />} onSelect={copyId}>
              Copy project ID
            </MenuItem>
          </Menu>
        </div>
      </header>

      {/* Phones: a one-line summary keeps actions above the fold. ≥640px: the full stepper. */}
      <Card padding="none" className="p-4 sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm">
            <span className="text-ink-tertiary">
              Stage {STAGES.findIndex((s) => s.id === p.stage) + 1} of {STAGES.length} ·{' '}
            </span>
            <span className="font-semibold">{stage.label}</span>
          </p>
          <ProjectStepper project={p} variant="compact" />
        </div>
      </Card>
      <Card padding="none" className="p-5 max-sm:hidden sm:p-6">
        <ProjectStepper project={p} />
      </Card>

      {h.reasons.length > 0 && h.health !== 'complete' && (
        <Alert
          tone={h.health === 'blocked' ? 'danger' : 'warning'}
          title={h.health === 'blocked' ? 'This project is blocked' : 'This project is at risk'}
          action={
            h.health === 'blocked' ? (
              <Button size="sm" variant="secondary" onClick={() => setTab('blockers')}>
                View blockers
              </Button>
            ) : (
              <Button size="sm" variant="secondary" onClick={() => setTab('updates')}>
                Send update
              </Button>
            )
          }
        >
          <ul className="list-disc pl-4">
            {h.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </Alert>
      )}

      <Tabs value={tab} onChange={setTab}>
        <TabList label="Project sections">
          <Tab value="overview">Overview</Tab>
          <Tab value="blockers" count={open.length}>
            Blockers
          </Tab>
          <Tab value="updates" count={p.updates.length}>
            Homeowner updates
          </Tab>
          <Tab value="activity">Activity</Tab>
        </TabList>

        <TabPanel value="overview" className="pt-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
            <ChecklistCard project={p} onAdvance={() => setAdvanceOpen(true)} blockedReason={blockedReason} complete={complete} nextLabel={next?.label} />
            <div className="space-y-6">
              <Card>
                <CardHeader title="Homeowner" level={2} />
                <dl className="space-y-3 text-sm">
                  <div className="flex items-center gap-2.5">
                    <dt className="flex shrink-0">
                      <Phone aria-hidden="true" className="size-4 text-ink-tertiary" />
                      <span className="sr-only">Phone</span>
                    </dt>
                    <dd className="flex min-w-0 items-center gap-2.5 tabular">
                      {p.homeowner.phone || '—'}
                      {p.preferredChannel === 'sms' && <Badge size="sm">Preferred</Badge>}
                    </dd>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <dt className="flex shrink-0">
                      <Mail aria-hidden="true" className="size-4 text-ink-tertiary" />
                      <span className="sr-only">Email</span>
                    </dt>
                    <dd className="flex min-w-0 items-center gap-2.5">
                      <span className="truncate">{p.homeowner.email || '—'}</span>
                      {p.preferredChannel === 'email' && <Badge size="sm">Preferred</Badge>}
                    </dd>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <dt className="flex shrink-0">
                      <MessageSquareText aria-hidden="true" className="size-4 text-ink-tertiary" />
                      <span className="sr-only">Last update</span>
                    </dt>
                    <dd>{p.updates[0] ? `Last updated ${relativeDays(p.updates[0].sentAt)}` : 'Never updated'}</dd>
                  </div>
                </dl>
                <div className="mt-4 flex items-center gap-2.5 border-t border-line-subtle pt-4 text-sm">
                  <Avatar name={p.coordinator} size="sm" decorative />
                  <span>
                    <span className="block font-medium">{p.coordinator}</span>
                    <span className="text-xs text-ink-tertiary">Coordinator</span>
                  </span>
                </div>
              </Card>
              <Card className="bg-paper-base">
                <p className="text-2xs font-semibold tracking-wider text-ink-tertiary uppercase">Homeowner sees this stage as</p>
                <p className="mt-2 font-serif text-2xl leading-tight">{stage.homeownerLabel}</p>
                <p className="mt-2 text-sm text-ink-secondary">{stage.homeownerExplainer}</p>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-tertiary">
                  <Clock3 aria-hidden="true" className="size-3.5" /> Usually {stage.typicalDuration}
                </p>
              </Card>
            </div>
          </div>
        </TabPanel>

        <TabPanel value="blockers" className="pt-6">
          <BlockersPanel project={p} onAdd={() => setAddBlockerOpen(true)} onResolve={setResolving} />
        </TabPanel>

        <TabPanel value="updates" className="pt-6">
          <div className="space-y-8">
            <Card>
              <CardHeader title="New update" description={`To ${p.homeowner.name} · currently at “${stage.homeownerLabel}”`} level={2} />
              <UpdateComposer key={`${p.stage}-${open.length}-${p.updates.length}`} project={p} />
            </Card>
            <section aria-labelledby="history-title">
              <h2 id="history-title" className="mb-3 text-md font-semibold tracking-tight">
                Sent updates
              </h2>
              {p.updates.length === 0 ? (
                <Card>
                  <EmptyState icon={<MessageSquareText />} title="No updates yet">
                    The first update sets expectations. Send one as soon as the project starts.
                  </EmptyState>
                </Card>
              ) : (
                <ol className="space-y-3">
                  {p.updates.map((u) => (
                    <li key={u.id} className="rounded-lg border border-line-default bg-paper-raised p-4">
                      <p className="flex flex-wrap items-center gap-2 text-xs text-ink-tertiary">
                        <Badge size="sm" icon={u.channel === 'sms' ? <MessageSquareText /> : <Mail />}>
                          {u.channel === 'sms' ? 'Text' : 'Email'}
                        </Badge>
                        <time dateTime={u.sentAt}>{formatDateTime(u.sentAt)}</time>
                        <span>· during {STAGE_BY_ID[u.stage].label}</span>
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{u.message}</p>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </div>
        </TabPanel>

        <TabPanel value="activity" className="pt-6">
          <ActivityTimeline project={p} />
        </TabPanel>
      </Tabs>

      <AdvanceStageDialog project={p} open={advanceOpen} onClose={() => setAdvanceOpen(false)} />
      <AddBlockerDialog project={p} open={addBlockerOpen} onClose={() => setAddBlockerOpen(false)} />
      <ResolveBlockerDialog project={p} blocker={resolving} onClose={() => setResolving(null)} />
    </div>
  );
}

function ChecklistCard({
  project: p,
  onAdvance,
  blockedReason,
  complete,
  nextLabel,
}: {
  project: Project;
  onAdvance: () => void;
  blockedReason: string | null;
  complete: boolean;
  nextLabel?: string;
}) {
  const { toggleChecklist } = useProjects();
  const { items, requiredDone, requiredTotal } = stageChecklist(p);
  const stage = STAGE_BY_ID[p.stage];
  return (
    <Card>
      <CardHeader title={`${stage.label} checklist`} description="Required items must be done before the project can move on." level={2} />
      <ProgressBar value={requiredDone} max={requiredTotal} label={`${stage.label} required items complete`} showValue tone={requiredDone === requiredTotal ? 'success' : 'ink'} />
      <fieldset className="mt-4">
        <legend className="sr-only">{stage.label} checklist</legend>
        <ul className="divide-y divide-line-subtle">
          {items.map((item) => (
            <li key={item.id}>
              <Checkbox
                className="py-3"
                checked={item.done}
                onChange={() => toggleChecklist(p.id, p.stage, item.id)}
                strikeWhenChecked
                label={
                  <span className="inline-flex flex-wrap items-center gap-2">
                    {item.label}
                    {!item.required && <Badge size="sm">Optional</Badge>}
                  </span>
                }
              />
            </li>
          ))}
        </ul>
      </fieldset>
      <div className="mt-5 flex flex-col gap-3 border-t border-line-subtle pt-5 sm:flex-row sm:items-center sm:justify-between">
        {complete ? (
          <p className="flex items-center gap-2 text-sm font-medium text-success-fg">
            <CircleCheck aria-hidden="true" className="size-4" /> Project complete. The system is on.
          </p>
        ) : p.stage === 'pto' ? (
          <p className="text-sm text-ink-tertiary">Finish the required items to complete the project.</p>
        ) : (
          <>
            <p id="advance-hint" className={cx('text-sm', blockedReason ? 'text-ink-tertiary' : 'text-success-fg')}>
              {blockedReason ?? `Ready to move to ${nextLabel}.`}
            </p>
            <Button variant="primary" trailingIcon={<ArrowRight />} disabled={Boolean(blockedReason)} aria-describedby="advance-hint" onClick={onAdvance} className="max-sm:w-full">
              Move to {nextLabel}
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}

function BlockersPanel({ project: p, onAdd, onResolve }: { project: Project; onAdd: () => void; onResolve: (b: Blocker) => void }) {
  const open = openBlockers(p);
  const resolved = p.blockers.filter((b) => b.resolvedAt);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-ink-secondary">{open.length === 0 ? 'No open blockers.' : `${open.length} open blocker${open.length === 1 ? '' : 's'}. Resolve them to move the project forward.`}</p>
        <Button size="sm" variant="secondary" leadingIcon={<Plus />} onClick={onAdd}>
          Add blocker
        </Button>
      </div>
      {open.length === 0 ? (
        <Card>
          <EmptyState icon={<CircleCheck />} title="Nothing is in the way">
            When something stops this project — a city request, a backorder, a missing document — add it here so the whole team can see it.
          </EmptyState>
        </Card>
      ) : (
        <ul className="space-y-3">
          {open.map((b) => (
            <li key={b.id} className="animate-rise rounded-lg border border-danger-line bg-paper-raised p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-md bg-danger-bg text-danger-fg">
                  <OctagonAlert className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{b.title}</p>
                  <p className="mt-0.5 text-sm text-ink-tertiary">
                    {BLOCKER_CATEGORY[b.category].label} · waiting on {b.waitingOn} · open {daysBetween(b.openedAt)}d
                  </p>
                  {b.detail && <p className="mt-2 text-sm text-ink-secondary">{b.detail}</p>}
                </div>
                <Tooltip content="Record what changed and reopen the path forward">
                  <Button size="sm" variant="primary" onClick={() => onResolve(b)} className="max-sm:w-full">
                    Resolve
                  </Button>
                </Tooltip>
              </div>
            </li>
          ))}
        </ul>
      )}
      {resolved.length > 0 && (
        <section aria-labelledby="resolved-title">
          <h2 id="resolved-title" className="mb-2 text-2xs font-semibold tracking-wider text-ink-tertiary uppercase">
            Resolved
          </h2>
          <ul className="divide-y divide-line-subtle rounded-lg border border-line-default bg-paper-raised">
            {resolved.map((b) => (
              <li key={b.id} className="flex items-start gap-3 px-4 py-3 text-sm">
                <CircleCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success-fg" />
                <div className="min-w-0">
                  <p className="text-ink-secondary line-through decoration-line-strong">{b.title}</p>
                  <p className="text-ink-tertiary">
                    {b.resolution} · {b.resolvedAt && relativeDays(b.resolvedAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

const ACTIVITY_DOT: Record<ActivityKind, string> = {
  created: 'bg-ink-tertiary',
  stage: 'bg-ember-600',
  checklist: 'bg-line-strong',
  'blocker-opened': 'bg-danger-fg',
  'blocker-resolved': 'bg-success-fg',
  'update-sent': 'bg-info-fg',
};

function ActivityTimeline({ project: p }: { project: Project }) {
  return (
    <Card>
      <CardHeader title="Activity" description="Everything that happened on this project, newest first." level={2} />
      <ol className="relative space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-line-default">
        {p.activity.map((a) => (
          <li key={a.id} className="relative flex gap-4 pl-0">
            <span aria-hidden="true" className={cx('relative mt-1.5 size-[11px] shrink-0 rounded-full ring-4 ring-paper-raised', ACTIVITY_DOT[a.kind])} />
            <div className="min-w-0 text-sm">
              <p className="text-ink-primary">{a.text}</p>
              <p className="text-xs text-ink-tertiary">
                {a.actor} · <time dateTime={a.at}>{formatDateTime(a.at)}</time>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

function DetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading project" className="space-y-6">
      <Skeleton className="h-4 w-20" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <Skeleton className="h-24 w-full rounded-lg" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}
