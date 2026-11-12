import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { createSeedProjects, CURRENT_USER } from '../data/seed';
import type { BlockerCategory, Channel, Project, StageId } from '../domain/types';
import { buildNewProject, projectsReducer, type NewProjectInput } from './projectsReducer';

const STORAGE_KEY = 'groundwork.projects.v1';

/**
 * SIMULATED LATENCY: there is no backend. A short artificial delay on first load exists
 * only to exercise the loading (skeleton) state. Add `?latency=0` to the URL to skip it.
 */
const SIMULATED_LATENCY_MS = 450;

function loadInitial(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Project[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // storage blocked or corrupt — fall back to seed
  }
  return createSeedProjects();
}

const now = () => new Date().toISOString();
const rid = (p: string) => `${p}_${Math.random().toString(36).slice(2, 9)}`;

interface ProjectsApi {
  projects: Project[];
  loading: boolean;
  currentUser: string;
  getProject: (id: string) => Project | undefined;
  toggleChecklist: (projectId: string, stage: StageId, itemId: string) => void;
  advanceStage: (projectId: string) => void;
  addBlocker: (projectId: string, b: { category: BlockerCategory; title: string; detail?: string; waitingOn: string }) => void;
  resolveBlocker: (projectId: string, blockerId: string, resolution: string) => void;
  reopenBlocker: (projectId: string, blockerId: string) => void;
  sendUpdate: (projectId: string, channel: Channel, message: string) => Promise<void>;
  createProject: (input: NewProjectInput) => Project;
  resetDemo: () => void;
}

const ProjectsContext = createContext<ProjectsApi | null>(null);

export function ProjectsProvider({ children, latencyMs }: { children: ReactNode; latencyMs?: number }) {
  const [projects, dispatch] = useReducer(projectsReducer, undefined, loadInitial);
  const latency = latencyMs ?? (new URLSearchParams(window.location.search).get('latency') === '0' ? 0 : SIMULATED_LATENCY_MS);
  const [loading, setLoading] = useState(latency > 0);

  useEffect(() => {
    if (latency === 0) return;
    const t = window.setTimeout(() => setLoading(false), latency);
    return () => window.clearTimeout(t);
  }, [latency]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {
      // persistence is a convenience; ignore failures
    }
  }, [projects]);

  const getProject = useCallback((id: string) => projects.find((p) => p.id === id), [projects]);

  const api = useMemo<ProjectsApi>(
    () => ({
      projects,
      loading,
      currentUser: CURRENT_USER,
      getProject,
      toggleChecklist: (projectId, stage, itemId) => dispatch({ type: 'toggleChecklist', projectId, stage, itemId, actor: CURRENT_USER, at: now() }),
      advanceStage: (projectId) => dispatch({ type: 'advanceStage', projectId, actor: CURRENT_USER, at: now() }),
      addBlocker: (projectId, b) => dispatch({ type: 'addBlocker', projectId, blockerId: rid('blk'), ...b, actor: CURRENT_USER, at: now() }),
      resolveBlocker: (projectId, blockerId, resolution) => dispatch({ type: 'resolveBlocker', projectId, blockerId, resolution, actor: CURRENT_USER, at: now() }),
      reopenBlocker: (projectId, blockerId) => dispatch({ type: 'reopenBlocker', projectId, blockerId }),
      // SIMULATED: no SMS or email is delivered. The update is recorded locally only.
      sendUpdate: (projectId, channel, message) =>
        new Promise((resolve) => {
          window.setTimeout(() => {
            dispatch({ type: 'sendUpdate', projectId, updateId: rid('upd'), channel, message, actor: CURRENT_USER, at: now() });
            resolve();
          }, latency > 0 ? 700 : 0);
        }),
      createProject: (input) => {
        const project = buildNewProject(input, projects, CURRENT_USER, now());
        dispatch({ type: 'createProject', project });
        return project;
      },
      resetDemo: () => dispatch({ type: 'reset', projects: createSeedProjects() }),
    }),
    [projects, loading, getProject, latency],
  );

  return <ProjectsContext.Provider value={api}>{children}</ProjectsContext.Provider>;
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error('useProjects must be used inside <ProjectsProvider>');
  return ctx;
}
