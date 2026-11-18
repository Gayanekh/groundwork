import { lazy, Suspense, useEffect } from 'react';
import { Compass } from 'lucide-react';
import { EmptyState, ToastProvider, buttonStyles } from '@/design-system';
import { Link, matchPath, navigate, useLocation } from './app/router';
import { ProjectsProvider } from './app/state/ProjectsStore';
import { AppShell } from './app/layout/AppShell';
import { TodayPage } from './app/pages/TodayPage';
import { ProjectsPage } from './app/pages/ProjectsPage';
import { ProjectDetailPage } from './app/pages/ProjectDetailPage';

// Loaded on demand: the marketing page is the only consumer of the `motion` package.
const CaseStudyPage = lazy(() => import('./site/CaseStudyPage').then((m) => ({ default: m.CaseStudyPage })));
const ProductPage = lazy(() => import('./site/product/ProductPage').then((m) => ({ default: m.ProductPage })));

const TITLES: Record<string, string> = {
  '/': 'Groundwork — Post-sale operations for home-energy installers',
  '/case-study': 'Case study · Groundwork',
  '/app': 'Today · Groundwork',
  '/app/projects': 'Projects · Groundwork',
};

function Routes() {
  const { pathname } = useLocation();
  const detail = matchPath('/app/projects/:id', pathname);

  const legacy = pathname === '/product' || pathname === '/product/';

  useEffect(() => {
    // The landing page used to live at /product. It is the homepage now.
    if (legacy) navigate('/', { replace: true });
  }, [legacy]);

  useEffect(() => {
    document.title = TITLES[pathname] ?? (detail ? `${detail.id} · Groundwork` : 'Not found · Groundwork');
  }, [pathname, detail]);

  if (legacy) return null;
  if (pathname === '/case-study' || pathname === '/case-study/') {
    return (
      <Suspense fallback={<div className="min-h-dvh bg-paper-base" aria-busy="true" />}>
        <CaseStudyPage />
      </Suspense>
    );
  }
  if (pathname === '/' || pathname === '') {
    return (
      <Suspense fallback={<div className="min-h-dvh bg-paper-base" aria-busy="true" />}>
        <ProductPage />
      </Suspense>
    );
  }

  let page;
  if (pathname === '/app' || pathname === '/app/') page = <TodayPage />;
  else if (matchPath('/app/projects', pathname)) page = <ProjectsPage />;
  else if (detail) page = <ProjectDetailPage id={detail.id} />;
  else
    page = (
      <EmptyState
        variant="page"
        icon={<Compass />}
        titleAs="h1"
        title="This page doesn’t exist"
        action={
          <Link to="/app" className={buttonStyles({ variant: 'primary' })}>
            Go to Today
          </Link>
        }
      >
        Check the address, or head back to your projects.
      </EmptyState>
    );

  return <AppShell>{page}</AppShell>;
}

export default function App() {
  return (
    <ToastProvider>
      <ProjectsProvider>
        <Routes />
      </ProjectsProvider>
    </ToastProvider>
  );
}
