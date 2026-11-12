import { useMemo } from 'react';
import { ArrowRight, BellRing, CheckCheck, Clock3, OctagonAlert, PartyPopper } from 'lucide-react';
import { Avatar, Card, CardHeader, EmptyState, Skeleton, buttonStyles, cx } from '@/design-system';
import { Link } from '../router';
import { useProjects } from '../state/ProjectsStore';
import { daysSinceHomeownerUpdate, getHealth, openBlockers } from '../domain/health';
import { STAGE_BY_ID } from '../domain/stages';
import { relativeDays } from '../domain/format';
import { HealthBadge, ProjectStepper } from '../features/projectUi';
import type { Project } from '../domain/types';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

export function TodayPage() {
  const { projects, loading, currentUser } = useProjects();

  const mine = useMemo(() => projects.filter((p) => p.coordinator === currentUser), [projects, currentUser]);
  const ranked = useMemo(
    () =>
      mine
        .map((p) => ({ p, h: getHealth(p) }))
        .filter(({ h }) => h.health === 'blocked' || h.health === 'at-risk')
        .sort((a, b) => b.h.score - a.h.score),
    [mine],
  );

  const stats = useMemo(() => {
    const blocked = mine.filter((p) => openBlockers(p).length > 0).length;
    const atRisk = mine.filter((p) => getHealth(p).health === 'at-risk').length;
    const waiting = mine.filter((p) => getHealth(p).health !== 'complete' && daysSinceHomeownerUpdate(p) > 7).length;
    const active = mine.filter((p) => getHealth(p).health !== 'complete').length;
    return { blocked, atRisk, waiting, active };
  }, [mine]);

  const recent = useMemo(
    () =>
      projects
        .flatMap((p) => p.activity.slice(0, 3).map((a) => ({ a, p })))
        .sort((x, y) => (x.a.at < y.a.at ? 1 : -1))
        .slice(0, 6),
    [projects],
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-1">
        <p className="text-sm text-ink-tertiary">
          {new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}
        </p>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {greeting()}, {currentUser.split(' ')[0]}.
        </h1>
        <p className="text-base text-ink-secondary">
          {loading ? 'Loading your projects…' : ranked.length === 0 ? 'Nothing needs you right now.' : `${ranked.length} of your ${stats.active} active projects need attention, most urgent first.`}
        </p>
      </header>

      <section aria-label="Summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile loading={loading} label="Blocked" value={stats.blocked} icon={<OctagonAlert />} tone="danger" to="/app/projects?health=blocked&owner=me" />
        <StatTile loading={loading} label="At risk" value={stats.atRisk} icon={<Clock3 />} tone="warning" to="/app/projects?health=at-risk&owner=me" />
        <StatTile loading={loading} label="Homeowner waiting > 7 days" value={stats.waiting} icon={<BellRing />} tone="ember" to="/app/projects?owner=me&sort=update" />
        <StatTile loading={loading} label="Active projects" value={stats.active} icon={<CheckCheck />} tone="neutral" to="/app/projects?owner=me" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-labelledby="queue-title" aria-busy={loading}>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 id="queue-title" className="text-md font-semibold tracking-tight">
              Needs your attention
            </h2>
            <Link to="/app/projects?owner=me" className="text-sm font-medium text-ember-600 hover:text-ember-700">
              All my projects
            </Link>
          </div>
          {loading ? (
            <ul className="space-y-3">
              {[0, 1, 2].map((i) => (
                <li key={i} className="rounded-lg border border-line-default bg-paper-raised p-5">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="mt-3 h-3 w-72 max-w-full" />
                  <Skeleton className="mt-5 h-1.5 w-40" />
                </li>
              ))}
            </ul>
          ) : ranked.length === 0 ? (
            <Card>
              <EmptyState icon={<PartyPopper />} title="You’re all caught up" action={<Link to="/app/projects" className={buttonStyles({ variant: 'secondary', size: 'sm' })}>Browse all projects</Link>}>
                No blocked or at-risk projects, and every homeowner has heard from you this week.
              </EmptyState>
            </Card>
          ) : (
            <ol className="space-y-3">
              {ranked.map(({ p, h }, i) => (
                <li key={p.id} className="animate-rise" style={{ animationDelay: `${Math.min(i, 6) * 40}ms` }}>
                  <AttentionCard project={p} reasons={h.reasons} health={h.health} />
                </li>
              ))}
            </ol>
          )}
        </section>

        <Card as="section" aria-labelledby="recent-title" className="h-fit">
          <CardHeader title={<span id="recent-title">Recent activity</span>} description="Across the team" />
          {loading ? (
            <div className="space-y-4">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : (
            <ol className="space-y-4">
              {recent.map(({ a, p }) => (
                <li key={a.id} className="flex gap-3 text-sm">
                  <Avatar name={a.actor} size="xs" className="mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-ink-primary">
                      <Link to={`/app/projects/${p.id}`} className="font-medium hover:underline">
                        {p.homeowner.name}
                      </Link>{' '}
                      <span className="text-ink-secondary">· {a.text}</span>
                    </p>
                    <p className="text-xs text-ink-tertiary">
                      {a.actor} · {relativeDays(a.at)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>
    </div>
  );
}

const toneClass = {
  danger: 'text-danger-fg bg-danger-bg',
  warning: 'text-warning-fg bg-warning-bg',
  ember: 'text-ember-700 bg-ember-50',
  neutral: 'text-neutral-fg bg-neutral-bg',
};

function StatTile({ label, value, icon, tone, to, loading }: { label: string; value: number; icon: React.ReactNode; tone: keyof typeof toneClass; to: string; loading: boolean }) {
  return (
    <Link
      to={to}
      className="group flex flex-col justify-between gap-4 rounded-lg border border-line-default bg-paper-raised p-4 shadow-sm transition-[border-color,box-shadow] duration-fast hover:border-line-strong hover:shadow-md sm:p-5"
    >
      <span className="flex items-start justify-between gap-2">
        <span className="text-sm leading-tight text-ink-secondary">{label}</span>
        <span aria-hidden="true" className={cx('flex size-7 shrink-0 items-center justify-center rounded-sm [&_svg]:size-4', toneClass[tone])}>
          {icon}
        </span>
      </span>
      <span className="flex items-end justify-between">
        {loading ? <Skeleton className="h-8 w-10" /> : <span className="text-3xl leading-none font-semibold tracking-tight tabular">{value}</span>}
        <ArrowRight aria-hidden="true" className="size-4 text-ink-tertiary opacity-0 transition-all duration-fast group-hover:translate-x-0.5 group-hover:opacity-100" />
      </span>
    </Link>
  );
}

function AttentionCard({ project: p, reasons, health }: { project: Project; reasons: string[]; health: ReturnType<typeof getHealth>['health'] }) {
  const stage = STAGE_BY_ID[p.stage];
  return (
    <Link
      to={`/app/projects/${p.id}`}
      className="group block rounded-lg border border-line-default bg-paper-raised p-4 shadow-sm transition-[border-color,box-shadow] duration-fast hover:border-line-strong hover:shadow-md sm:p-5"
    >
      <div className="flex flex-wrap items-start gap-x-3 gap-y-2">
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-md font-semibold tracking-tight">{p.homeowner.name}</span>
            <span className="font-mono text-xs text-ink-tertiary">{p.id}</span>
          </p>
          <p className="mt-0.5 truncate text-sm text-ink-tertiary">
            {p.address.street}, {p.address.city} · {stage.label}
          </p>
        </div>
        <HealthBadge health={health} />
      </div>
      <ul className="mt-3 space-y-1">
        {reasons.map((r) => (
          <li key={r} className="flex items-start gap-2 text-sm text-ink-secondary">
            <span aria-hidden="true" className={cx('mt-2 size-1 shrink-0 rounded-full', health === 'blocked' ? 'bg-danger-fg' : 'bg-warning-fg')} />
            {r}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between gap-4">
        <ProjectStepper project={p} variant="compact" />
        <span className="flex items-center gap-1 text-sm font-medium text-ink-secondary group-hover:text-ink-primary">
          Open <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-fast group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
