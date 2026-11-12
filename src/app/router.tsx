import { useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react';

/**
 * A ~60-line History API router. The app has five routes, so a routing library would be
 * more dependency than value. Supports params (`/app/projects/:id`), query strings, and
 * modifier-click (open in new tab) on links.
 */

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

if (typeof window !== 'undefined') window.addEventListener('popstate', notify);

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

const getHref = () => window.location.pathname + window.location.search;

export function navigate(to: string, { replace = false }: { replace?: boolean } = {}) {
  if (to === getHref()) return;
  if (replace) window.history.replaceState(null, '', to);
  else window.history.pushState(null, '', to);
  notify();
}

export function useLocation() {
  const href = useSyncExternalStore(subscribe, getHref, () => '/');
  const url = new URL(href, 'http://local');
  return { pathname: url.pathname, search: url.searchParams, href };
}

/** Match `/app/projects/:id` against a pathname. Returns params or null. */
export function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  const p = pattern.split('/').filter(Boolean);
  const s = pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  if (p.length !== s.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(s[i]);
    else if (p[i] !== s[i]) return null;
  }
  return params;
}

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
}

export function Link({ to, replace, onClick, ...rest }: LinkProps) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target === '_blank') return;
    e.preventDefault();
    navigate(to, { replace });
  };
  return <a href={to} onClick={handle} {...rest} />;
}
