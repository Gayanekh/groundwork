import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, ChevronsUpDown, FolderKanban, Inbox, Menu as MenuIcon, Plus, RotateCcw, Sun } from 'lucide-react';
import { Avatar, Button, Dialog, IconButton, Menu, MenuItem, MenuLabel, cx, useToast } from '@/design-system';
import { Link, useLocation } from '../router';
import { useProjects } from '../state/ProjectsStore';
import { getHealth } from '../domain/health';
import { NewProjectDialog } from '../features/NewProjectDialog';
import { Logo } from './Logo';

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  match: (path: string) => boolean;
  count?: number;
}

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { projects, resetDemo, currentUser } = useProjects();
  const toast = useToast();
  const [drawer, setDrawer] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const attention = projects.filter((p) => {
    const h = getHealth(p).health;
    return p.coordinator === currentUser && (h === 'blocked' || h === 'at-risk');
  }).length;

  const nav: NavItem[] = [
    { to: '/app', label: 'Today', icon: <Inbox />, match: (p) => p === '/app', count: attention },
    { to: '/app/projects', label: 'Projects', icon: <FolderKanban />, match: (p) => p.startsWith('/app/projects') },
  ];

  // Route change: close drawer, reset scroll, move focus to main for screen-reader users.
  useEffect(() => {
    setDrawer(false);
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  const reset = () => {
    resetDemo();
    toast({ title: 'Demo data reset', description: 'All projects are back to their starting state.', tone: 'info' });
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5">
        <Link to="/app" className="rounded-sm" aria-label="Groundwork, go to Today">
          <Logo />
        </Link>
      </div>
      <div className="px-3">
        <Menu
          placement="bottom-start"
          trigger={
            <button
              type="button"
              className="flex w-full items-center gap-2.5 rounded-md border border-line-default bg-paper-raised px-2.5 py-2 text-left shadow-xs transition-colors hover:border-line-strong"
            >
              <span aria-hidden="true" className="flex size-7 items-center justify-center rounded-sm bg-ember-50 text-ember-700">
                <Sun className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">Brightline Home Energy</span>
                <span className="block text-xs text-ink-tertiary">Fictional installer · demo</span>
              </span>
              <ChevronsUpDown aria-hidden="true" className="size-4 text-ink-tertiary" />
            </button>
          }
        >
          <MenuLabel>Demo workspace</MenuLabel>
          <MenuItem icon={<RotateCcw />} onSelect={reset}>
            Reset demo data
          </MenuItem>
        </Menu>
      </div>
      <nav aria-label="Primary" className="mt-6 px-3">
        <ul className="flex flex-col gap-0.5">
          {nav.map((item) => {
            const active = item.match(pathname);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={cx(
                    'group relative flex h-9 items-center gap-3 rounded-md px-3 text-base font-medium transition-colors duration-fast pointer-coarse:h-11 [&_svg]:size-[18px]',
                    active ? 'bg-paper-raised text-ink-primary shadow-sm' : 'text-ink-secondary hover:bg-paper-sunken hover:text-ink-primary',
                  )}
                >
                  {active && <span aria-hidden="true" className="absolute top-2 bottom-2 -left-3 w-0.5 rounded-full bg-ember-600" />}
                  <span className={cx(active ? 'text-ember-600' : 'text-ink-tertiary group-hover:text-ink-secondary')}>{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.count ? (
                    <span className="rounded-full bg-paper-inverse px-1.5 text-xs leading-5 text-ink-inverse tabular">
                      {item.count}
                      <span className="sr-only"> need attention</span>
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 px-0">
          <Button variant="secondary" size="sm" fullWidth leadingIcon={<Plus />} onClick={() => setNewOpen(true)}>
            New project
          </Button>
        </div>
      </nav>

      <div className="mt-auto space-y-3 p-3">
        <Link
          to="/"
          className="group block rounded-md border border-dashed border-line-default p-3 text-sm transition-colors hover:border-line-strong hover:bg-paper-raised"
        >
          <span className="flex items-center justify-between font-semibold text-ink-primary">
            About this concept <ArrowUpRight aria-hidden="true" className="size-4 text-ink-tertiary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
          <span className="mt-0.5 block text-xs text-ink-tertiary">Independent speculative concept. Not affiliated with Artemis.</span>
        </Link>
        <div className="flex items-center gap-2.5 px-1">
          <Avatar name={currentUser} decorative />
          <div className="min-w-0 text-sm">
            <p className="truncate font-medium">{currentUser}</p>
            <p className="text-xs text-ink-tertiary">Project coordinator (fictional)</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="fixed top-2 left-2 z-[70] -translate-y-20 rounded-md bg-paper-inverse px-3 py-2 text-sm font-medium text-ink-inverse focus:translate-y-0"
      >
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line-subtle bg-paper-base lg:block">{sidebar}</aside>

      {/* Mobile drawer (same content, rendered in a modal for focus management) */}
      <Dialog open={drawer} onClose={() => setDrawer(false)} title="Navigation" placement="left" bare>
        {sidebar}
      </Dialog>

      <div className="lg:pl-64">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-line-subtle bg-paper-base/90 px-2 backdrop-blur lg:hidden">
          <IconButton aria-label="Open navigation" icon={<MenuIcon />} onClick={() => setDrawer(true)} />
          <Link to="/app" aria-label="Groundwork, go to Today" className="rounded-sm">
            <Logo />
          </Link>
          <div className="ml-auto">
            <IconButton aria-label="New project" variant="secondary" icon={<Plus />} onClick={() => setNewOpen(true)} />
          </div>
        </header>

        <aside aria-label="Prototype notice" className="border-b border-line-subtle bg-paper-sunken/60 px-4 py-1.5 text-center text-xs text-ink-tertiary sm:px-8">
          <span className="font-medium text-ink-secondary">Concept prototype.</span> All people, companies and data are illustrative. Messages and actions are simulated.
        </aside>

        <main id="main" ref={mainRef} tabIndex={-1} className="mx-auto w-full max-w-[88rem] px-4 pt-6 pb-24 outline-none sm:px-8 lg:pt-10">
          {children}
        </main>
      </div>

      <NewProjectDialog open={newOpen} onClose={() => setNewOpen(false)} />
    </div>
  );
}
