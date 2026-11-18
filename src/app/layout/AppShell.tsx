import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Plus, RotateCcw, Sparkles } from 'lucide-react';
import { Atmosphere, Avatar, Button, IconButton, Menu, MenuItem, MenuLabel, cx, useToast } from '@/design-system';
import { Link, navigate, useLocation } from '../router';
import { useProjects } from '../state/ProjectsStore';
import { getHealth } from '../domain/health';
import { NewProjectDialog } from '../features/NewProjectDialog';
import { Logo } from './Logo';

interface NavItem {
  to: string;
  label: string;
  match: (path: string) => boolean;
  count?: number;
}

/**
 * The prototype's frame. It is laid out like the landing page, not like an admin dashboard: a
 * top bar with the logo, pill navigation and one main action, then a centered page.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { projects, resetDemo, currentUser } = useProjects();
  const toast = useToast();
  const [newOpen, setNewOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  // Transparent over the top of the page, a light frosted bar once you scroll, like the landing page.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // The app uses the same cool "mist" surface as the landing page. Set on <html> so portals (dialogs, menus, toasts) match.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const before = root.getAttribute('data-surface');
    root.setAttribute('data-surface', 'mist');
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
    <div className="relative isolate min-h-dvh bg-paper-base">
      <Atmosphere parallax={false} className="absolute inset-x-0 top-0 -z-10 h-[32rem] opacity-80" />

      <a href="#main" className="fixed top-2 left-2 z-[70] -translate-y-20 rounded-md bg-paper-inverse px-3 py-2 text-sm font-medium text-ink-inverse focus:translate-y-0">
        Skip to content
      </a>

      <header className={cx('sticky top-0 z-30 border-b transition-[background-color,border-color] duration-base ease-standard', scrolled ? 'border-line-subtle/60 bg-paper-base/80 backdrop-blur-md' : 'border-transparent')}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-1 px-4 py-2 sm:px-8 md:h-16 md:flex-nowrap md:py-0">
          <Link to="/" className="rounded-sm" aria-label="Groundwork, go to the homepage">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="order-3 flex w-full items-center gap-1 pb-1 md:order-none md:w-auto md:flex-1 md:justify-center md:pb-0">
            {nav.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={cx(
                    'inline-flex h-10 items-center gap-2 rounded-full px-4 text-base whitespace-nowrap transition-colors duration-fast ease-standard',
                    active ? 'bg-paper-raised font-medium text-ink-primary shadow-float' : 'text-ink-secondary hover:bg-paper-raised/70 hover:text-ink-primary',
                  )}
                >
                  {item.label}
                  {item.count ? (
                    <span className="rounded-full bg-paper-inverse px-1.5 text-xs leading-5 text-ink-inverse tabular">
                      {item.count}
                      <span className="sr-only"> need attention</span>
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <Button variant="primary" leadingIcon={<Plus />} onClick={() => setNewOpen(true)} className="max-sm:hidden">
              New project
            </Button>
            <IconButton aria-label="New project" variant="secondary" icon={<Plus />} onClick={() => setNewOpen(true)} className="sm:hidden" />
            <Menu
              placement="bottom-end"
              trigger={
                <button type="button" aria-label="Account and demo options" className="grid size-10 place-items-center rounded-full transition-shadow duration-fast hover:shadow-float">
                  <Avatar name={currentUser} size="md" decorative />
                </button>
              }
            >
              <MenuLabel>{currentUser} · Project coordinator (fictional)</MenuLabel>
              <MenuItem icon={<RotateCcw />} onSelect={reset}>
                Reset demo data
              </MenuItem>
              <MenuItem icon={<Sparkles />} onSelect={() => navigate('/')}>
                About this concept
              </MenuItem>
            </Menu>
          </div>
        </div>
      </header>

      <main id="main" ref={mainRef} tabIndex={-1} className="mx-auto w-full max-w-6xl px-4 pt-8 pb-20 outline-none sm:px-8 md:pt-12">
        {children}
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 sm:px-8">
        <aside aria-label="Prototype notice" className="border-t border-line-default pt-6 text-sm text-ink-secondary">
          <span className="font-medium text-ink-primary">Concept prototype.</span> All people, companies and data are illustrative, and the portraits are stock photos. Messages and actions are simulated.
        </aside>
      </footer>

      <NewProjectDialog open={newOpen} onClose={() => setNewOpen(false)} />
    </div>
  );
}
