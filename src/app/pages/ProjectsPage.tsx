import { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutGrid, Plus, Rows3, Search, SearchX, X } from 'lucide-react';
import {
  Avatar,
  Button,
  EmptyState,
  IconButton,
  Input,
  Kbd,
  SegmentedControl,
  Select,
  Skeleton,
  Table,
  TableContainer,
  TBody,
  TD,
  TH,
  THead,
  TRow,
  cx,
  type SortDirection,
} from '@/design-system';
import { Link, navigate, useLocation } from '../router';
import { useProjects } from '../state/ProjectsStore';
import { daysInStage, daysSinceHomeownerUpdate, getHealth } from '../domain/health';
import { STAGES, STAGE_BY_ID, TRADE_LABEL, stageIndex } from '../domain/stages';
import { COORDINATORS } from '../data/seed';
import { HealthBadge, ProjectStepper } from '../features/projectUi';
import { NewProjectDialog } from '../features/NewProjectDialog';
import type { Health, Project, StageId } from '../domain/types';

type SortKey = 'name' | 'stage' | 'days' | 'update';
type HealthFilter = 'all' | Health;
type View = 'cards' | 'table';

const HEALTH_ORDER: Record<Health, number> = { blocked: 0, 'at-risk': 1, 'on-track': 2, complete: 3 };

export function ProjectsPage() {
  const { projects, loading, currentUser } = useProjects();
  const { search, pathname } = useLocation();
  const [newOpen, setNewOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // URL is the source of truth for filters: shareable, survives reload, back button works.
  const q = search.get('q') ?? '';
  const stage = (search.get('stage') ?? 'all') as StageId | 'all';
  const health = (search.get('health') ?? 'all') as HealthFilter;
  const owner = search.get('owner') ?? 'all';
  const sort = (search.get('sort') ?? 'health') as SortKey | 'health';
  const dir = (search.get('dir') ?? 'desc') as SortDirection;
  // Cards by default. The table is for comparing many projects on a wide screen; phones always get cards.
  const view: View = search.get('view') === 'table' ? 'table' : 'cards';

  const setParam = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(search);
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === '' || v === 'all') next.delete(k);
      else next.set(k, v);
    }
    const qs = next.toString();
    navigate(`${pathname}${qs ? `?${qs}` : ''}`, { replace: true });
  };

  // "/" focuses search (common pattern in data tools), unless typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(t.tagName) && !t.isContentEditable) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const ownerName = owner === 'me' ? currentUser : owner;

  const withHealth = useMemo(() => projects.map((p) => ({ p, h: getHealth(p) })), [projects]);

  const baseFiltered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return withHealth.filter(({ p }) => {
      if (owner !== 'all' && p.coordinator !== ownerName) return false;
      if (stage !== 'all' && p.stage !== stage) return false;
      if (!needle) return true;
      return [p.homeowner.name, p.id, p.address.street, p.address.city].some((s) => s.toLowerCase().includes(needle));
    });
  }, [withHealth, q, owner, ownerName, stage]);

  const healthCounts = useMemo(() => {
    const c: Record<HealthFilter, number> = { all: baseFiltered.length, blocked: 0, 'at-risk': 0, 'on-track': 0, complete: 0 };
    baseFiltered.forEach(({ h }) => c[h.health]++);
    return c;
  }, [baseFiltered]);

  const rows = useMemo(() => {
    const list = health === 'all' ? baseFiltered : baseFiltered.filter(({ h }) => h.health === health);
    const m = dir === 'asc' ? 1 : -1;
    const cmp: Record<SortKey | 'health', (a: (typeof list)[0], b: (typeof list)[0]) => number> = {
      health: (a, b) => (HEALTH_ORDER[a.h.health] - HEALTH_ORDER[b.h.health] || b.h.score - a.h.score) * -m,
      name: (a, b) => a.p.homeowner.name.localeCompare(b.p.homeowner.name) * m,
      stage: (a, b) => (stageIndex(a.p.stage) - stageIndex(b.p.stage)) * m,
      days: (a, b) => (daysInStage(a.p) - daysInStage(b.p)) * m,
      update: (a, b) => (daysSinceHomeownerUpdate(a.p) - daysSinceHomeownerUpdate(b.p)) * m,
    };
    return [...list].sort(cmp[sort]);
  }, [baseFiltered, health, sort, dir]);

  const sortBy = (key: SortKey | 'health') => setParam({ sort: key === 'health' ? null : key, dir: key === 'name' || key === 'stage' ? 'asc' : null });
  // Column headers: click once to sort, again to flip the direction.
  const sortByColumn = (key: SortKey) => {
    if (sort === key) setParam({ dir: dir === 'asc' ? 'desc' : 'asc' });
    else setParam({ sort: key, dir: key === 'name' || key === 'stage' ? 'asc' : 'desc' });
  };
  const sortedState = (key: SortKey) => (sort === key ? dir : false);

  const filtersActive = q || stage !== 'all' || health !== 'all' || owner !== 'all';
  const clearAll = () => navigate(pathname, { replace: true });

  const stageCounts = useMemo(() => {
    const c: Record<string, number> = {};
    withHealth.forEach(({ p }) => {
      if (owner !== 'all' && p.coordinator !== ownerName) return;
      c[p.stage] = (c[p.stage] ?? 0) + 1;
    });
    return c;
  }, [withHealth, owner, ownerName]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl leading-[1] font-medium tracking-[-0.04em] sm:text-6xl">Projects</h1>
          <p className="mt-3 text-md text-ink-secondary">Every signed project, from contract to switched on.</p>
        </div>
      </header>

      {/* Filter bar */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Input
            ref={searchRef}
            type="search"
            aria-label="Search projects by name, address or ID"
            placeholder="Search projects"
            value={q}
            onChange={(e) => setParam({ q: e.target.value })}
            leading={<Search />}
            trailing={
              q ? (
                <IconButton size="sm" aria-label="Clear search" icon={<X />} onClick={() => setParam({ q: null })} />
              ) : (
                <span className="pr-1.5 max-md:hidden pointer-coarse:hidden">
                  <Kbd>/</Kbd>
                </span>
              )
            }
            className="md:max-w-sm md:flex-1"
          />
          <div className="grid grid-cols-2 gap-3 md:flex md:flex-wrap">
            <Select<StageId | 'all'>
              aria-label="Filter by stage"
              prefix="Stage"
              value={stage}
              onChange={(v) => setParam({ stage: v })}
              className="md:w-52"
              options={[{ value: 'all', label: 'All stages' }, ...STAGES.map((s) => ({ value: s.id, label: s.label, description: String(stageCounts[s.id] ?? 0) }))]}
            />
            <Select
              aria-label="Filter by coordinator"
              prefix="Owner"
              value={owner}
              onChange={(v) => setParam({ owner: v })}
              className="md:w-56"
              options={[
                { value: 'all', label: 'Everyone' },
                { value: 'me', label: `Me (${currentUser.split(' ')[0]})` },
                ...COORDINATORS.filter((c) => c !== currentUser).map((c) => ({ value: c, label: c })),
              ]}
            />
            <Select<SortKey | 'health'>
              aria-label="Sort projects"
              prefix="Sort"
              value={sort}
              onChange={sortBy}
              className="col-span-2 md:col-span-1 md:w-60"
              options={[
                { value: 'health', label: 'Most urgent' },
                { value: 'name', label: 'Name' },
                { value: 'stage', label: 'Stage' },
                { value: 'days', label: 'Longest in stage' },
                { value: 'update', label: 'Longest without an update' },
              ]}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SegmentedControl<HealthFilter>
            label="Filter by health"
            size="sm"
            value={health}
            onChange={(v) => setParam({ health: v })}
            options={[
              { value: 'all', label: 'All', count: healthCounts.all },
              { value: 'blocked', label: 'Blocked', count: healthCounts.blocked },
              { value: 'at-risk', label: 'At risk', count: healthCounts['at-risk'] },
              { value: 'on-track', label: 'On track', count: healthCounts['on-track'] },
              { value: 'complete', label: 'Complete', count: healthCounts.complete },
            ]}
          />
          <div className="flex items-center gap-4">
            <SegmentedControl<View>
              label="Show projects as"
              size="sm"
              value={view}
              onChange={(v) => setParam({ view: v === 'cards' ? null : v })}
              className="max-md:hidden"
              options={[
                { value: 'cards', label: <span className="inline-flex items-center gap-1.5"><LayoutGrid aria-hidden="true" className="size-3.5" /> Cards</span> },
                { value: 'table', label: <span className="inline-flex items-center gap-1.5"><Rows3 aria-hidden="true" className="size-3.5" /> Table</span> },
              ]}
            />
          <p className="text-sm text-ink-tertiary" aria-live="polite">
            {loading ? 'Loading…' : `${rows.length} project${rows.length === 1 ? '' : 's'}`}
            {filtersActive && !loading && (
              <>
                {' · '}
                <button type="button" onClick={clearAll} className="font-medium text-ember-600 hover:text-ember-700">
                  Clear filters
                </button>
              </>
            )}
          </p>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingRows />
      ) : rows.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line-default">
          <EmptyState
            variant="page"
            icon={<SearchX />}
            title="No projects match"
            action={
              <>
                <Button variant="secondary" onClick={clearAll}>
                  Clear filters
                </Button>
                <Button variant="primary" leadingIcon={<Plus />} onClick={() => setNewOpen(true)}>
                  New project
                </Button>
              </>
            }
          >
            {q ? <>Nothing matches “{q}” with the current filters.</> : 'Try a different stage, owner or health filter.'}
          </EmptyState>
        </div>
      ) : (
        <>
          <ul className={cx('grid grid-cols-1 gap-4 md:grid-cols-2', view === 'table' && 'md:hidden')}>
            {rows.map(({ p, h }) => (
              <li key={p.id}>
                <ProjectCard project={p} health={h.health} />
              </li>
            ))}
          </ul>

          {view === 'table' && (
            <TableContainer label="Projects" className="max-md:hidden">
              <Table>
                <caption className="sr-only">Projects, sorted by {sort === 'health' ? 'urgency' : sort}</caption>
                <THead>
                  <tr>
                    <TH sortable sorted={sortedState('name')} onSort={() => sortByColumn('name')}>
                      Homeowner
                    </TH>
                    <TH sortable sorted={sortedState('stage')} onSort={() => sortByColumn('stage')}>
                      Stage
                    </TH>
                    <TH>Health</TH>
                    <TH sortable sorted={sortedState('days')} onSort={() => sortByColumn('days')} align="right">
                      In stage
                    </TH>
                    <TH sortable sorted={sortedState('update')} onSort={() => sortByColumn('update')} align="right" className="max-lg:hidden">
                      Last update
                    </TH>
                    <TH className="max-xl:hidden">Owner</TH>
                  </tr>
                </THead>
                <TBody>
                  {rows.map(({ p, h }) => (
                    <ProjectRow key={p.id} project={p} health={h.health} />
                  ))}
                </TBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {/* Mobile FAB alternative lives in the top bar; this keeps parity on small screens */}
      <NewProjectDialog open={newOpen} onClose={() => setNewOpen(false)} />
    </div>
  );
}

function ProjectRow({ project: p, health }: { project: Project; health: Health }) {
  const inStage = daysInStage(p);
  const sla = STAGE_BY_ID[p.stage].slaDays;
  const silent = daysSinceHomeownerUpdate(p);
  const href = `/app/projects/${p.id}`;
  return (
    <TRow interactive onClick={(e) => !(e.target as HTMLElement).closest('a') && navigate(href)}>
      <TD>
        <Link to={href} className="font-semibold text-ink-primary hover:underline">
          {p.homeowner.name}
        </Link>
        <p className="text-xs text-ink-tertiary">
          <span className="font-mono">{p.id}</span> · {p.address.city} · {TRADE_LABEL[p.trade]}
        </p>
      </TD>
      <TD>
        <p className="mb-1.5 text-sm">{STAGE_BY_ID[p.stage].label}</p>
        <ProjectStepper project={p} variant="compact" />
      </TD>
      <TD>
        <HealthBadge health={health} />
      </TD>
      <TD align="right" className="tabular">
        <span className={inStage > sla && health !== 'complete' ? 'font-medium text-warning-fg' : ''}>{inStage}d</span>
        <span className="text-ink-tertiary"> / {sla}d</span>
      </TD>
      <TD align="right" className="tabular max-lg:hidden">
        <span className={silent > 7 && health !== 'complete' ? 'font-medium text-warning-fg' : 'text-ink-secondary'}>{silent === 0 ? 'Today' : `${silent}d ago`}</span>
      </TD>
      <TD className="max-xl:hidden">
        <span className="flex items-center gap-2 text-sm text-ink-secondary">
          <Avatar name={p.coordinator} size="xs" decorative />
          {p.coordinator}
        </span>
      </TD>
    </TRow>
  );
}

/** One project as a card: who, how long it has been in this stage against its target, and where it sits in the journey. */
function ProjectCard({ project: p, health }: { project: Project; health: Health }) {
  const inStage = daysInStage(p);
  const stage = STAGE_BY_ID[p.stage];
  const silent = daysSinceHomeownerUpdate(p);
  const tone = health === 'blocked' ? 'text-danger-fg' : health === 'at-risk' ? 'text-warning-fg' : 'text-ink-primary';
  return (
    <Link
      to={`/app/projects/${p.id}`}
      className="group flex h-full flex-col rounded-3xl border border-line-subtle bg-paper-raised p-5 transition-shadow duration-base ease-standard hover:shadow-float sm:p-6"
    >
      <div className="flex items-center gap-3">
        <Avatar name={p.homeowner.name} size="lg" decorative />
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-semibold tracking-tight">{p.homeowner.name}</p>
          <p className="truncate text-sm text-ink-tertiary">
            {p.address.street}, {p.address.city} · {TRADE_LABEL[p.trade]}
          </p>
        </div>
        <HealthBadge health={health} size="sm" />
      </div>

      <div className="mt-7 flex items-end gap-3">
        <span className={cx('text-6xl leading-none font-medium tracking-[-0.05em] tabular', tone)}>{inStage}d</span>
        <span className="pb-1 text-sm leading-snug text-ink-secondary">
          in {stage.label}.
          <br />
          Target is {stage.slaDays} days.
        </span>
      </div>

      <div className="mt-5">
        <ProjectStepper project={p} variant="compact" />
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-6 text-sm text-ink-secondary">
        <span className="flex min-w-0 items-center gap-2">
          <Avatar name={p.coordinator} size="xs" decorative />
          <span className="truncate">{p.coordinator}</span>
        </span>
        <span className={cx('shrink-0 tabular', silent > 7 && health !== 'complete' && 'font-medium text-warning-fg')}>
          {silent === 0 ? 'Updated today' : `Updated ${silent}d ago`}
        </span>
      </div>
    </Link>
  );
}

function LoadingRows() {
  return (
    <ul aria-busy="true" aria-label="Loading projects" className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {[0, 1, 2, 3].map((i) => (
        <li key={i} className="rounded-3xl border border-line-subtle bg-paper-raised p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="size-11 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-56 max-w-full" />
            </div>
          </div>
          <Skeleton className="mt-8 h-12 w-28" />
          <Skeleton className="mt-6 h-1.5 w-40" />
        </li>
      ))}
    </ul>
  );
}
