import { describe, expect, it } from 'vitest';
import { advanceBlockedReason, getHealth, isComplete } from './health';
import { draftMessage, findJargon, replaceJargon, smsSegments } from './plainLanguage';
import { STAGES, checklistKey } from './stages';
import type { Project, StageId } from './types';
import { validateNewProject } from '../features/NewProjectDialog';

const NOW = new Date('2026-06-15T12:00:00Z');
const daysAgo = (d: number) => new Date(NOW.getTime() - d * 86_400_000).toISOString();

function project(overrides: Partial<Project> = {}): Project {
  return {
    id: 'GW-1',
    homeowner: { name: 'Test Person', phone: '', email: '' },
    address: { street: '1 Test St', city: 'Testville', state: 'CA', zip: '90000' },
    trade: 'solar',
    coordinator: 'Dana Whitfield',
    preferredChannel: 'sms',
    stage: 'permit',
    stageEnteredAt: daysAgo(5),
    createdAt: daysAgo(30),
    checklist: {},
    blockers: [],
    updates: [{ id: 'u', sentAt: daysAgo(2), channel: 'sms', message: 'hi', stage: 'permit' }],
    activity: [],
    ...overrides,
  };
}

const allDone = (stage: StageId) =>
  Object.fromEntries(STAGES.find((s) => s.id === stage)!.checklist.map((i) => [checklistKey(stage, i.id), true]));

describe('getHealth', () => {
  it('is on track when within target, unblocked and recently updated', () => {
    expect(getHealth(project(), NOW).health).toBe('on-track');
  });

  it('is blocked when any blocker is open, and explains why', () => {
    const h = getHealth(project({ blockers: [{ id: 'b', category: 'permit', title: 'City letter', waitingOn: 'City', openedAt: daysAgo(3) }] }), NOW);
    expect(h.health).toBe('blocked');
    expect(h.reasons[0]).toBe('Blocked 3d: City letter');
  });

  it('ignores resolved blockers', () => {
    const p = project({ blockers: [{ id: 'b', category: 'permit', title: 'x', waitingOn: 'y', openedAt: daysAgo(3), resolvedAt: daysAgo(1) }] });
    expect(getHealth(p, NOW).health).toBe('on-track');
  });

  it('is at risk when over the stage target', () => {
    const h = getHealth(project({ stageEnteredAt: daysAgo(25) }), NOW); // permit target is 21d
    expect(h.health).toBe('at-risk');
    expect(h.reasons).toContain('4d over the 21-day stage target');
  });

  it('is at risk when the homeowner has not been updated in over 7 days', () => {
    const h = getHealth(project({ updates: [] }), NOW); // created 30d ago, never updated
    expect(h.health).toBe('at-risk');
    expect(h.reasons[0]).toMatch(/Homeowner not updated in 30d/);
  });

  it('ranks blocked projects above at-risk ones', () => {
    const blocked = getHealth(project({ blockers: [{ id: 'b', category: 'utility', title: 't', waitingOn: 'w', openedAt: daysAgo(1) }] }), NOW);
    const atRisk = getHealth(project({ stageEnteredAt: daysAgo(40) }), NOW);
    expect(blocked.score).toBeGreaterThan(atRisk.score);
  });

  it('is complete when PTO required items are done', () => {
    const p = project({ stage: 'pto', checklist: allDone('pto') });
    expect(isComplete(p)).toBe(true);
    expect(getHealth(p, NOW).health).toBe('complete');
  });
});

describe('advanceBlockedReason', () => {
  it('requires every required checklist item', () => {
    expect(advanceBlockedReason(project())).toBe('Complete 3 more required checklist items first.');
  });
  it('requires open blockers to be resolved', () => {
    const p = project({ checklist: allDone('permit'), blockers: [{ id: 'b', category: 'permit', title: 't', waitingOn: 'w', openedAt: daysAgo(1) }] });
    expect(advanceBlockedReason(p)).toMatch(/Resolve open blockers/);
  });
  it('allows advancing when done and unblocked', () => {
    expect(advanceBlockedReason(project({ checklist: allDone('permit') }))).toBeNull();
  });
  it('ignores optional items', () => {
    const p = project({ stage: 'survey', checklist: { 'survey.scheduled': true, 'survey.completed': true } });
    expect(advanceBlockedReason(p)).toBeNull();
  });
});

describe('plain-language check', () => {
  it('finds jargon case-insensitively, whole words only', () => {
    const hits = findJargon('Waiting on the ahj for the PTO. Stipend is fine.');
    expect(hits.map((h) => h.term)).toEqual(['AHJ', 'PTO']);
  });

  it('prefers the longer overlapping term', () => {
    const hits = findJargon('We updated the plan set and the change order.');
    expect(hits.map((h) => h.term)).toEqual(['plan set', 'change order']);
  });

  it('replaces every occurrence of a term', () => {
    expect(replaceJargon('PTO soon. After PTO, enjoy.', 'PTO', 'approval')).toBe('approval soon. After approval, enjoy.');
  });

  it('never drafts jargon for any stage or template', () => {
    for (const s of STAGES) {
      for (const t of ['progress', 'delay', 'action'] as const) {
        expect(findJargon(draftMessage(project({ stage: s.id }), t))).toEqual([]);
      }
    }
  });

  it('counts SMS segments', () => {
    expect(smsSegments('a'.repeat(160))).toBe(1);
    expect(smsSegments('a'.repeat(161))).toBe(2);
  });
});

describe('validateNewProject', () => {
  const valid = {
    homeownerName: 'Jordan Rivera',
    phone: '(714) 555-0142',
    email: '',
    street: '1 Main',
    city: 'Fullerton',
    zip: '92831',
    trade: 'solar' as const,
    systemKw: '',
    coordinator: 'Dana Whitfield',
    preferredChannel: 'sms' as const,
  };
  it('accepts a valid project', () => expect(validateNewProject(valid)).toEqual({}));
  it('requires a phone for text updates and an email for email updates', () => {
    expect(validateNewProject({ ...valid, phone: '' }).phone).toBeDefined();
    expect(validateNewProject({ ...valid, preferredChannel: 'email' }).email).toBeDefined();
  });
  it('validates ZIP and size', () => {
    expect(validateNewProject({ ...valid, zip: '9283' }).zip).toMatch(/5-digit/);
    expect(validateNewProject({ ...valid, systemKw: '0' }).systemKw).toBeDefined();
  });
});
