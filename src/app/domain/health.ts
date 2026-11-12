import { STAGE_BY_ID, checklistKey } from './stages';
import type { Health, Project } from './types';

const DAY = 86_400_000;

/** Days the homeowner can go without an update before the project is flagged. Illustrative default. */
export const HOMEOWNER_SILENCE_DAYS = 7;

export const daysBetween = (fromIso: string, now: Date = new Date()) => Math.max(0, Math.floor((now.getTime() - new Date(fromIso).getTime()) / DAY));

export const openBlockers = (p: Project) => p.blockers.filter((b) => !b.resolvedAt);

export function lastUpdateAt(p: Project): string | undefined {
  return p.updates.reduce<string | undefined>((latest, u) => (!latest || u.sentAt > latest ? u.sentAt : latest), undefined);
}

export function daysSinceHomeownerUpdate(p: Project, now = new Date()) {
  return daysBetween(lastUpdateAt(p) ?? p.createdAt, now);
}

export function daysInStage(p: Project, now = new Date()) {
  return daysBetween(p.stageEnteredAt, now);
}

export function stageChecklist(p: Project) {
  const def = STAGE_BY_ID[p.stage];
  const items = def.checklist.map((item) => ({ ...item, done: Boolean(p.checklist[checklistKey(p.stage, item.id)]) }));
  const required = items.filter((i) => i.required);
  return { items, requiredDone: required.filter((i) => i.done).length, requiredTotal: required.length, done: items.filter((i) => i.done).length };
}

export function isComplete(p: Project) {
  if (p.stage !== 'pto') return false;
  const { requiredDone, requiredTotal } = stageChecklist(p);
  return requiredDone === requiredTotal;
}

export interface HealthResult {
  health: Health;
  /** Human-readable reasons, most important first. Shown in UI, never color alone. */
  reasons: string[];
  /** Higher = needs attention sooner. Used to rank the Today queue. */
  score: number;
}

/**
 * Derive project health. Pure function of the project + clock, so it is unit-tested
 * and never stored (stored health goes stale).
 */
export function getHealth(p: Project, now = new Date()): HealthResult {
  if (isComplete(p)) return { health: 'complete', reasons: ['System is on'], score: -1 };

  const reasons: string[] = [];
  let score = 0;
  const blockers = openBlockers(p);
  const sla = STAGE_BY_ID[p.stage].slaDays;
  const inStage = daysInStage(p, now);
  const silent = daysSinceHomeownerUpdate(p, now);

  for (const b of blockers) {
    const age = daysBetween(b.openedAt, now);
    reasons.push(`Blocked ${age}d: ${b.title}`);
    score += 100 + age * 3;
  }
  if (inStage > sla) {
    reasons.push(`${inStage - sla}d over the ${sla}-day stage target`);
    score += 40 + (inStage - sla) * 2;
  }
  if (silent > HOMEOWNER_SILENCE_DAYS) {
    reasons.push(`Homeowner not updated in ${silent}d`);
    score += 30 + silent;
  }

  const health: Health = blockers.length > 0 ? 'blocked' : reasons.length > 0 ? 'at-risk' : 'on-track';
  return { health, reasons, score };
}

/** Why "Advance stage" is unavailable, or null when it is allowed. Drives disabled state + helper text. */
export function advanceBlockedReason(p: Project): string | null {
  if (p.stage === 'pto') return null;
  const { requiredDone, requiredTotal } = stageChecklist(p);
  if (openBlockers(p).length > 0) return 'Resolve open blockers before moving to the next stage.';
  if (requiredDone < requiredTotal) return `Complete ${requiredTotal - requiredDone} more required checklist item${requiredTotal - requiredDone === 1 ? '' : 's'} first.`;
  return null;
}
