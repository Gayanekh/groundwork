import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Search, SearchX, X } from 'lucide-react';
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

  const sortBy = (key: SortKey) => {
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
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Projects</h1>
          <p className="mt-1 text-base text-ink-secondary">Every signed project from contract to PTO.</p>
        </div>
        <Button variant="primary" leadingIcon={<Plus />} onClick={() => setNewOpen(true)} className="max-sm:hidden">
          New project
        </Button>
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
          <div className="grid grid-cols-2 gap-3 md:flex">
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

      {loading ? (
        <LoadingRows />
      ) : rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line-default">
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
          {/* ≥768px: table */}
          <TableContainer label="Projects" className="max-md:hidden">
            <Table>
              <caption className="sr-only">Projects, sorted by {sort === 'health' ? 'urgency' : sort}</caption>
              <THead>
                <tr>
                  <TH sortable sorted={sortedState('name')} onSort={() => sortBy('name')}>
                    Homeowner
                  </TH>
                  <TH sortable sorted={sortedState('stage')} onSort={() => sortBy('stage')}>
                    Stage
                  </TH>
                  <TH>Health</TH>
                  <TH sortable sorted={sortedState('days')} onSort={() => sortBy('days')} align="right">
                    In stage
                  </TH>
                  <TH sortable sorted={sortedState('update')} onSort={() => sortBy('update')} align="right" className="max-lg:hidden">
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

          {/* <768px: cards */}
          <ul className="space-y-3 md:hidden">
            {rows.map(({ p, h }) => (
              <li key={p.id}>
                <Link to={`/app/projects/${p.id}`} className="block rounded-lg border border-line-default bg-paper-raised p-4 shadow-sm active:bg-paper-base">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold">{p.homeowner.name}</p>
                      <p className="truncate text-sm text-ink-tertiary">
                        {p.address.city} · <span className="font-mono text-xs">{p.id}</span>
                      </p>
                    </div>
                    <HealthBadge health={h.health} size="sm" />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <ProjectStepper project={p} variant="compact" />
                    <span className="text-sm text-ink-secondary">
                      {STAGE_BY_ID[p.stage].label} · <span className="tabular">{daysInStage(p)}d</span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
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

function LoadingRows() {
  return (
    <div aria-busy="true" aria-label="Loading projects" className="rounded-lg border border-line-default bg-paper-raised">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-6 border-b border-line-subtle px-4 py-4 last:border-0">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3 w-56 max-w-full" />
          </div>
          <Skeleton className="h-6 w-20 max-sm:hidden" />
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  );
}
