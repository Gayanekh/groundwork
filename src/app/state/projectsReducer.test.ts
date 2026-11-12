import { describe, expect, it } from 'vitest';
import { projectsReducer } from './projectsReducer';
import { createSeedProjects } from '../data/seed';

const AT = '2026-06-15T12:00:00.000Z';
const base = { actor: 'Tester', at: AT };

describe('projectsReducer', () => {
  it('will not advance a project whose checklist is incomplete (domain guard, not just UI)', () => {
    const state = createSeedProjects();
    const before = state.find((p) => p.id === 'GW-1046')!; // permit, 2 of 3 done
    const after = projectsReducer(state, { type: 'advanceStage', projectId: before.id, ...base }).find((p) => p.id === before.id)!;
    expect(after.stage).toBe('permit');
  });

  it('advances, resets the stage timer and logs activity once requirements are met', () => {
    let state = createSeedProjects();
    state = projectsReducer(state, { type: 'toggleChecklist', projectId: 'GW-1046', stage: 'permit', itemId: 'approved', ...base });
    state = projectsReducer(state, { type: 'advanceStage', projectId: 'GW-1046', ...base });
    const p = state.find((x) => x.id === 'GW-1046')!;
    expect(p.stage).toBe('install');
    expect(p.stageEnteredAt).toBe(AT);
    expect(p.activity[0].text).toBe('Moved to Installation');
  });

  it('resolves and reopens a blocker (undo)', () => {
    let state = createSeedProjects();
    const b = state.find((p) => p.id === 'GW-1048')!.blockers[0];
    state = projectsReducer(state, { type: 'resolveBlocker', projectId: 'GW-1048', blockerId: b.id, resolution: 'Letter uploaded', ...base });
    expect(state.find((p) => p.id === 'GW-1048')!.blockers[0].resolvedAt).toBe(AT);
    state = projectsReducer(state, { type: 'reopenBlocker', projectId: 'GW-1048', blockerId: b.id });
    const p = state.find((x) => x.id === 'GW-1048')!;
    expect(p.blockers[0].resolvedAt).toBeUndefined();
    expect(p.activity[0].kind).not.toBe('blocker-resolved');
  });

  it('records homeowner updates newest first', () => {
    const state = projectsReducer(createSeedProjects(), { type: 'sendUpdate', projectId: 'GW-1032', updateId: 'u1', channel: 'email', message: 'Hello', ...base });
    const p = state.find((x) => x.id === 'GW-1032')!;
    expect(p.updates[0]).toMatchObject({ id: 'u1', channel: 'email', stage: 'inspection' });
  });

  it('seeds only fictional contact data', () => {
    for (const p of createSeedProjects()) {
      expect(p.homeowner.email.endsWith('@example.com')).toBe(true);
      expect(p.homeowner.phone).toMatch(/555-01\d\d$/);
    }
  });
});
