import { STAGE_BY_ID, STAGES, checklistKey, nextStage } from '../domain/stages';
import { advanceBlockedReason } from '../domain/health';
import type { BlockerCategory, Channel, Project, StageId, Trade } from '../domain/types';

export type NewProjectInput = {
  homeownerName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  zip: string;
  trade: Trade;
  systemKw?: number;
  coordinator: string;
  preferredChannel: Channel;
};

export type Action =
  | { type: 'toggleChecklist'; projectId: string; stage: StageId; itemId: string; actor: string; at: string }
  | { type: 'advanceStage'; projectId: string; actor: string; at: string }
  | { type: 'addBlocker'; projectId: string; blockerId: string; category: BlockerCategory; title: string; detail?: string; waitingOn: string; actor: string; at: string }
  | { type: 'resolveBlocker'; projectId: string; blockerId: string; resolution: string; actor: string; at: string }
  | { type: 'reopenBlocker'; projectId: string; blockerId: string }
  | { type: 'sendUpdate'; projectId: string; updateId: string; channel: Channel; message: string; actor: string; at: string }
  | { type: 'createProject'; project: Project }
  | { type: 'reset'; projects: Project[] };

let seq = 0;
const eid = () => `evt_${Date.now().toString(36)}_${(seq++).toString(36)}`;

function updateProject(state: Project[], id: string, fn: (p: Project) => Project): Project[] {
  return state.map((p) => (p.id === id ? fn(p) : p));
}

/**
 * All state transitions in one pure reducer: easy to test, easy to swap for a server later
 * (each action maps 1:1 to a future API mutation).
 */
export function projectsReducer(state: Project[], action: Action): Project[] {
  switch (action.type) {
    case 'toggleChecklist':
      return updateProject(state, action.projectId, (p) => {
        const key = checklistKey(action.stage, action.itemId);
        const done = !p.checklist[key];
        const label = STAGE_BY_ID[action.stage].checklist.find((i) => i.id === action.itemId)?.label ?? action.itemId;
        return {
          ...p,
          checklist: { ...p.checklist, [key]: done },
          activity: [{ id: eid(), at: action.at, kind: 'checklist', text: `${done ? 'Checked' : 'Unchecked'}: ${label}`, actor: action.actor }, ...p.activity],
        };
      });

    case 'advanceStage':
      return updateProject(state, action.projectId, (p) => {
        // Guard lives in the domain too, not only in the disabled button.
        if (advanceBlockedReason(p)) return p;
        const next = nextStage(p.stage);
        if (!next) return p;
        return {
          ...p,
          stage: next.id,
          stageEnteredAt: action.at,
          activity: [{ id: eid(), at: action.at, kind: 'stage', text: `Moved to ${next.label}`, actor: action.actor }, ...p.activity],
        };
      });

    case 'addBlocker':
      return updateProject(state, action.projectId, (p) => ({
        ...p,
        blockers: [
          { id: action.blockerId, category: action.category, title: action.title, detail: action.detail, waitingOn: action.waitingOn, openedAt: action.at },
          ...p.blockers,
        ],
        activity: [{ id: eid(), at: action.at, kind: 'blocker-opened', text: `Blocker opened: ${action.title}`, actor: action.actor }, ...p.activity],
      }));

    case 'resolveBlocker':
      return updateProject(state, action.projectId, (p) => {
        const b = p.blockers.find((x) => x.id === action.blockerId);
        return {
          ...p,
          blockers: p.blockers.map((x) => (x.id === action.blockerId ? { ...x, resolvedAt: action.at, resolution: action.resolution } : x)),
          activity: [{ id: eid(), at: action.at, kind: 'blocker-resolved', text: `Blocker resolved: ${b?.title ?? ''}`, actor: action.actor }, ...p.activity],
        };
      });

    case 'reopenBlocker':
      return updateProject(state, action.projectId, (p) => ({
        ...p,
        blockers: p.blockers.map((x) => (x.id === action.blockerId ? { ...x, resolvedAt: undefined, resolution: undefined } : x)),
        activity: p.activity.filter((a, i) => !(i === 0 && a.kind === 'blocker-resolved')),
      }));

    case 'sendUpdate':
      return updateProject(state, action.projectId, (p) => ({
        ...p,
        updates: [{ id: action.updateId, sentAt: action.at, channel: action.channel, message: action.message, stage: p.stage }, ...p.updates],
        activity: [{ id: eid(), at: action.at, kind: 'update-sent', text: `Homeowner update sent by ${action.channel === 'sms' ? 'text' : 'email'}`, actor: action.actor }, ...p.activity],
      }));

    case 'createProject':
      return [action.project, ...state];

    case 'reset':
      return action.projects;
  }
}

export function buildNewProject(input: NewProjectInput, existing: Project[], actor: string, at: string): Project {
  const max = existing.reduce((m, p) => Math.max(m, Number(p.id.replace(/\D/g, '')) || 0), 1000);
  return {
    id: `GW-${max + 1}`,
    homeowner: { name: input.homeownerName.trim(), phone: input.phone.trim(), email: input.email.trim() },
    address: { street: input.street.trim(), city: input.city.trim(), state: 'CA', zip: input.zip.trim() },
    trade: input.trade,
    systemKw: input.systemKw,
    coordinator: input.coordinator,
    preferredChannel: input.preferredChannel,
    stage: STAGES[0].id,
    stageEnteredAt: at,
    createdAt: at,
    checklist: {},
    blockers: [],
    updates: [],
    activity: [{ id: eid(), at, kind: 'created', text: 'Project created', actor }],
  };
}
