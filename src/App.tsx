import { useEffect } from 'react';
import { Compass } from 'lucide-react';
import { EmptyState, ToastProvider, buttonStyles } from '@/design-system';
import { Link, matchPath, useLocation } from './app/router';
import { ProjectsProvider } from './app/state/ProjectsStore';
import { AppShell } from './app/layout/AppShell';
import { TodayPage } from './app/pages/TodayPage';
import { ProjectsPage } from './app/pages/ProjectsPage';
import { ProjectDetailPage } from './app/pages/ProjectDetailPage';
import { PresentationPage } from './site/PresentationPage';

const TITLES: Record<string, string> = {
  '/': 'Groundwork — Independent Speculative Concept',
  '/app': 'Today · Groundwork',
  '/app/projects': 'Projects · Groundwork',
};

function Routes() {
  const { pathname } = useLocation();
  const detail = matchPath('/app/projects/:id', pathname);

  useEffect(() => {
    document.title = TITLES[pathname] ?? (detail ? `${detail.id} · Groundwork` : 'Not found · Groundwork');
  }, [pathname, detail]);

  if (pathname === '/' || pathname === '') return <PresentationPage />;

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
