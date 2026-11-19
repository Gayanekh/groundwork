import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Plus, RotateCcw, Sparkles } from 'lucide-react';
import { Avatar, Menu, MenuItem, MenuLabel, cx, useToast } from '@/design-system';
import { Link, navigate, useLocation } from '../router';
import { useProjects } from '../state/ProjectsStore';
import { getHealth } from '../domain/health';
import { NewProjectDialog } from '../features/NewProjectDialog';
import { Logo } from './Logo';
import { TopBar } from './TopBar';
import { coreButton } from './coreButton';

interface NavItem {
  to: string;
  label: string;
  match: (path: string) => boolean;
  count?: number;
}

/**
 * The prototype's frame. It looks like the landing page, not like an admin dashboard: the same floating
 * near-black bar with the logo, two links and the main action, then a centered page on the white "core" surface.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { projects, resetDemo, currentUser } = useProjects();
  const toast = useToast();
  const [newOpen, setNewOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  const attention = projects.filter((p) => {
    const h = getHealth(p).health;
    return p.coordinator === currentUser && (h === 'blocked' || h === 'at-risk');
  }).length;

  const nav: NavItem[] = [
    { to: '/app', label: 'Today', match: (p) => p === '/app', count: attention },
    { to: '/app/projects', label: 'Projects', match: (p) => p.startsWith('/app/projects') },
  ];

  // Route change: reset scroll and move focus to main for screen-reader users.
  useEffect(() => {
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  // The app uses the same neutral "core" surface as the landing page. Set on <html> so portals (dialogs, menus, toasts) match.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const before = root.getAttribute('data-surface');
    root.setAttribute('data-surface', 'core');
    return () => {
      if (before === null) root.removeAttribute('data-surface');
      else root.setAttribute('data-surface', before);
    };
  }, []);

  const reset = () => {
    resetDemo();
    toast({ title: 'Demo data reset', description: 'All projects are back to their starting state.', tone: 'info' });
  };

  return (
    <div className="relative min-h-dvh bg-paper-base font-sans [--color-paper-raised:var(--color-core-chip)]">
      <a href="#main" className="fixed top-2 left-2 z-[70] -translate-y-20 rounded-md bg-paper-inverse px-3 py-2 text-sm font-medium text-ink-inverse focus:translate-y-0">
        Skip to content
      </a>

      <TopBar
        brand={
          <Link to="/" className="rounded-sm" aria-label="Groundwork, go to the homepage">
            <Logo onDark />
          </Link>
        }
        links={nav.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? 'page' : undefined}
              className={cx(
                'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-base tracking-[0.01em] whitespace-nowrap transition-colors duration-300 ease-standard',
                active ? 'bg-core-chip/15' : 'hover:bg-core-chip/10',
              )}
            >
              {item.label}
              {item.count ? (
                <span className="rounded-md bg-core-chip px-1.5 text-xs leading-5 text-core-ink tabular">
                  {item.count}
                  <span className="sr-only"> need attention</span>
                </span>
              ) : null}
            </Link>
          );
        })}
        actions={
          <>
            <button type="button" onClick={() => setNewOpen(true)} className={coreButton('light')}>
              <Plus aria-hidden="true" /> New project
            </button>
            <AccountMenu name={currentUser} onReset={reset} />
          </>
        }
        menuLabel="Open menu"
        menu={
          <>
            {nav.map((item) => (
              <MenuItem key={item.to} onSelect={() => navigate(item.to)}>
                {item.label}
                {item.count ? ` (${item.count} need attention)` : ''}
              </MenuItem>
            ))}
            <MenuItem icon={<Plus />} onSelect={() => setNewOpen(true)}>
              New project
            </MenuItem>
            <MenuItem icon={<RotateCcw />} onSelect={reset}>
              Reset demo data
            </MenuItem>
            <MenuItem icon={<Sparkles />} onSelect={() => navigate('/')}>
              About this concept
            </MenuItem>
          </>
        }
      />

      <main id="main" ref={mainRef} tabIndex={-1} className="mx-auto w-full max-w-7xl px-4 pt-32 pb-20 outline-none sm:px-10 md:pt-36">
        {children}
      </main>

      <footer className="mx-auto max-w-7xl px-4 pb-10 sm:px-10">
        <aside aria-label="Prototype notice" className="border-t border-line-default pt-6 text-sm text-ink-secondary">
          <span className="font-medium text-ink-primary">Concept prototype.</span> All people, companies and data are illustrative, and the portraits are stock photos. Messages and actions are simulated.
        </aside>
      </footer>

      <NewProjectDialog open={newOpen} onClose={() => setNewOpen(false)} />
    </div>
  );
}

/** The avatar menu in the bar (wide screens). On small screens the same items live in the hamburger menu. */
function AccountMenu({ name, onReset }: { name: string; onReset: () => void }) {
  return (
    <Menu
      placement="bottom-end"
      trigger={
        <button type="button" aria-label="Account and demo options" className="grid size-10 place-items-center rounded-full transition-opacity duration-fast hover:opacity-80">
          <Avatar name={name} size="md" decorative />
        </button>
      }
    >
      <MenuLabel>{name} · Project coordinator (fictional)</MenuLabel>
      <MenuItem icon={<RotateCcw />} onSelect={onReset}>
        Reset demo data
      </MenuItem>
      <MenuItem icon={<Sparkles />} onSelect={() => navigate('/')}>
        About this concept
      </MenuItem>
    </Menu>
  );
}
