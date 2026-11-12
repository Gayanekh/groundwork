import { CircleCheck, OctagonAlert, TriangleAlert, CircleDot } from 'lucide-react';
import { Badge, Stepper, type Step, type Tone } from '@/design-system';
import { STAGES, stageIndex } from '../domain/stages';
import { daysInStage, getHealth, isComplete, openBlockers } from '../domain/health';
import { formatDate } from '../domain/format';
import type { Health, Project } from '../domain/types';

export const HEALTH_META: Record<Health, { label: string; tone: Tone; icon: typeof CircleCheck }> = {
  blocked: { label: 'Blocked', tone: 'danger', icon: OctagonAlert },
  'at-risk': { label: 'At risk', tone: 'warning', icon: TriangleAlert },
  'on-track': { label: 'On track', tone: 'success', icon: CircleDot },
  complete: { label: 'Complete', tone: 'neutral', icon: CircleCheck },
};

/** Health badge: icon + text, so status never relies on color alone. */
export function HealthBadge({ health, size }: { health: Health; size?: 'sm' | 'md' }) {
  const m = HEALTH_META[health];
  const Icon = m.icon;
  return (
    <Badge tone={m.tone} size={size} icon={<Icon aria-hidden="true" />}>
      {m.label}
    </Badge>
  );
}

export function projectSteps(p: Project): Step[] {
  const current = stageIndex(p.stage);
  const blocked = openBlockers(p).length > 0;
  const complete = isComplete(p);
  return STAGES.map((s, i) => {
    const status: Step['status'] = complete || i < current ? 'complete' : i === current ? (blocked ? 'blocked' : 'current') : 'upcoming';
    let meta: string | undefined;
    if (i === current && !complete) meta = `${daysInStage(p)}d · target ${s.slaDays}d`;
    if (i === current - 1) meta = `Done ${formatDate(p.stageEnteredAt)}`;
    return { id: s.id, label: s.label, status, meta };
  });
}

export function ProjectStepper({ project, variant = 'full' }: { project: Project; variant?: 'full' | 'compact' }) {
  return <Stepper steps={projectSteps(project)} label={`Stages for ${project.homeowner.name}`} variant={variant} />;
}

export function useHealth(p: Project) {
  return getHealth(p);
}
