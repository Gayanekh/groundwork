/**
 * ILLUSTRATIVE DEMO DATA.
 * Every person, company, address, phone number and email below is fictional.
 * Phone numbers use the reserved 555-0100–0199 range; emails use example.com.
 * "Brightline Home Energy" is a fictional installer used to give the demo context.
 */
import { daysAgoIso } from '../domain/format';
import { STAGES, checklistKey, stageIndex } from '../domain/stages';
import type { ActivityEvent, Blocker, Channel, HomeownerUpdate, Project, StageId, Trade } from '../domain/types';

export const COORDINATORS = ['Dana Whitfield', 'Marcus Lee', 'Priya Raman'] as const;
export const CURRENT_USER = 'Dana Whitfield';

interface SeedInput {
  id: string;
  name: string;
  street: string;
  city: string;
  zip: string;
  trade: Trade;
  kw?: number;
  coordinator: (typeof COORDINATORS)[number];
  stage: StageId;
  daysInStage: number;
  createdDaysAgo: number;
  /** Checklist item ids done in the current stage. */
  done?: string[];
  blockers?: Array<Omit<Blocker, 'id' | 'openedAt'> & { daysAgo: number }>;
  /** Days ago that homeowner updates were sent. */
  updatesDaysAgo?: number[];
  channel?: Channel;
}

let n = 0;
const uid = (p: string) => `${p}_${(++n).toString(36)}`;

function build(s: SeedInput): Project {
  const idx = stageIndex(s.stage);
  const checklist: Record<string, boolean> = {};
  STAGES.forEach((st, i) => {
    st.checklist.forEach((item) => {
      if (i < idx) checklist[checklistKey(st.id, item.id)] = true;
      if (i === idx && s.done?.includes(item.id)) checklist[checklistKey(st.id, item.id)] = true;
    });
  });

  const blockers: Blocker[] = (s.blockers ?? []).map(({ daysAgo, ...b }) => ({ ...b, id: uid('blk'), openedAt: daysAgoIso(daysAgo, 9) }));

  // newest first, matching how the reducer prepends new updates
  const updates: HomeownerUpdate[] = [...(s.updatesDaysAgo ?? [])].sort((a, b) => a - b).map((d) => ({
    id: uid('upd'),
    sentAt: daysAgoIso(d, 15),
    channel: s.channel ?? 'sms',
    stage: s.stage,
    message: `Hi ${s.name.split(' ')[0]}, quick update on your project. We are on track and will reach out before the next step. — ${s.coordinator.split(' ')[0]}, Brightline Home Energy`,
  }));

  const activity: ActivityEvent[] = [
    { id: uid('act'), at: daysAgoIso(s.createdDaysAgo, 11), kind: 'created' as const, text: 'Project created from signed contract', actor: s.coordinator },
    ...(idx > 0 ? [{ id: uid('act'), at: daysAgoIso(s.daysInStage, 10), kind: 'stage' as const, text: `Moved to ${STAGES[idx].label}`, actor: s.coordinator }] : []),
    ...blockers.map((b) => ({ id: uid('act'), at: b.openedAt, kind: 'blocker-opened' as const, text: `Blocker opened: ${b.title}`, actor: s.coordinator })),
    ...updates.map((u) => ({ id: uid('act'), at: u.sentAt, kind: 'update-sent' as const, text: `Homeowner update sent by ${u.channel === 'sms' ? 'text' : 'email'}`, actor: s.coordinator })),
  ].sort((a, b) => (a.at < b.at ? 1 : -1));

  const digits = s.id.slice(-2);
  return {
    id: s.id,
    homeowner: {
      name: s.name,
      // 555-0100 to 555-0199 is reserved for fictional use
      phone: `(714) 555-01${digits}`,
      email: `${s.name.toLowerCase().replace(/[^a-z]+/g, '.')}@example.com`,
    },
    address: { street: s.street, city: s.city, state: 'CA', zip: s.zip },
    trade: s.trade,
    systemKw: s.kw,
    coordinator: s.coordinator,
    preferredChannel: s.channel ?? 'sms',
    stage: s.stage,
    stageEnteredAt: daysAgoIso(s.daysInStage, 10),
    createdAt: daysAgoIso(s.createdDaysAgo, 11),
    checklist,
    blockers,
    updates,
    activity,
  };
}

export function createSeedProjects(): Project[] {
  n = 0;
  return [
    build({
      id: 'GW-1048', name: 'Maria Delgado', street: '1482 Larkspur Lane', city: 'Riverside', zip: '92503', trade: 'solar-battery', kw: 8.4,
      coordinator: 'Dana Whitfield', stage: 'permit', daysInStage: 26, createdDaysAgo: 44, done: ['submitted', 'fee'],
      blockers: [{ category: 'permit', title: 'City requested a structural letter', detail: 'Plan check comment #2: roof framing calc required for the battery wall mount.', waitingOn: 'Structural engineer', daysAgo: 6 }],
      updatesDaysAgo: [30, 18, 9],
    }),
    build({
      id: 'GW-1051', name: 'James Okafor', street: '77 Sycamore Court', city: 'Fullerton', zip: '92831', trade: 'solar', kw: 6.2,
      coordinator: 'Dana Whitfield', stage: 'pto', daysInStage: 12, createdDaysAgo: 71, done: ['application'],
      blockers: [{ category: 'utility', title: 'Meter swap not yet scheduled', waitingOn: 'Utility metering department', daysAgo: 4 }],
      updatesDaysAgo: [40, 20, 11], channel: 'email',
    }),
    build({
      id: 'GW-1055', name: 'Rebecca Stein', street: '2210 Marigold Avenue', city: 'Orange', zip: '92867', trade: 'roofing',
      coordinator: 'Dana Whitfield', stage: 'survey', daysInStage: 9, createdDaysAgo: 11, done: [],
      blockers: [{ category: 'homeowner', title: 'Homeowner has not confirmed survey date', detail: 'Two voicemails left. Offered Tue or Thu morning.', waitingOn: 'Rebecca Stein', daysAgo: 5 }],
      updatesDaysAgo: [10],
    }),
    build({
      id: 'GW-1032', name: 'Aisha Bello', street: '908 Canyon Ridge Road', city: 'Corona', zip: '92882', trade: 'solar', kw: 7.1,
      coordinator: 'Dana Whitfield', stage: 'inspection', daysInStage: 6, createdDaysAgo: 63, done: ['scheduled'],
      updatesDaysAgo: [35, 22, 11], channel: 'email',
    }),
    build({
      id: 'GW-1053', name: 'Hannah Brooks', street: '415 Willow Bend', city: 'Anaheim', zip: '92804', trade: 'solar-battery', kw: 9.6,
      coordinator: 'Marcus Lee', stage: 'design', daysInStage: 7, createdDaysAgo: 19, done: ['planset'],
      blockers: [{ category: 'financing', title: 'Lender stip: proof of income', waitingOn: 'Hannah Brooks via lender portal', daysAgo: 3 }],
      updatesDaysAgo: [12, 3],
    }),
    build({
      id: 'GW-1041', name: 'Omar Haddad', street: '3301 Coral Tree Drive', city: 'Irvine', zip: '92618', trade: 'solar-battery', kw: 11.2,
      coordinator: 'Marcus Lee', stage: 'install', daysInStage: 8, createdDaysAgo: 52, done: ['crew'],
      blockers: [{ category: 'materials', title: 'Battery backordered at distributor', detail: 'New ETA from distributor: 9 days.', waitingOn: 'Distributor', daysAgo: 2 }],
      updatesDaysAgo: [25, 8, 2],
    }),
    build({
      id: 'GW-1039', name: 'Linh Tran', street: '56 Harbor View Way', city: 'Huntington Beach', zip: '92648', trade: 'solar', kw: 5.8,
      coordinator: 'Priya Raman', stage: 'install', daysInStage: 3, createdDaysAgo: 41, done: ['materials', 'crew'],
      updatesDaysAgo: [20, 9, 2],
    }),
    build({
      id: 'GW-1044', name: 'Carlos Mendoza', street: '1290 Juniper Street', city: 'Placentia', zip: '92870', trade: 'solar-roofing', kw: 7.9,
      coordinator: 'Priya Raman', stage: 'design', daysInStage: 2, createdDaysAgo: 14, done: ['planset'],
      updatesDaysAgo: [8, 2],
    }),
    build({
      id: 'GW-1046', name: 'Daniel Ruiz', street: '742 Mesa Verde Drive', city: 'Costa Mesa', zip: '92626', trade: 'solar', kw: 6.6,
      coordinator: 'Marcus Lee', stage: 'permit', daysInStage: 10, createdDaysAgo: 30, done: ['submitted', 'fee'],
      updatesDaysAgo: [15, 4],
    }),
    build({
      id: 'GW-1036', name: 'Emily Nguyen', street: '18 Poppy Field Circle', city: 'Brea', zip: '92821', trade: 'roofing',
      coordinator: 'Priya Raman', stage: 'inspection', daysInStage: 2, createdDaysAgo: 38, done: [],
      updatesDaysAgo: [16, 2], channel: 'email',
    }),
    build({
      id: 'GW-1057', name: 'Tom Hargrove', street: '5120 Oak Knoll Road', city: 'Yorba Linda', zip: '92886', trade: 'solar', kw: 8.0,
      coordinator: 'Dana Whitfield', stage: 'contract', daysInStage: 1, createdDaysAgo: 1, done: ['welcome'],
      updatesDaysAgo: [1],
    }),
    build({
      id: 'GW-1034', name: 'Samuel Ortiz', street: '233 Lantern Bay Street', city: 'Tustin', zip: '92780', trade: 'solar-battery', kw: 10.4,
      coordinator: 'Marcus Lee', stage: 'pto', daysInStage: 5, createdDaysAgo: 80, done: ['application', 'meter'],
      updatesDaysAgo: [30, 5],
    }),
    build({
      id: 'GW-1027', name: 'Grace Kim', street: '64 Bluebell Terrace', city: 'La Habra', zip: '90631', trade: 'solar', kw: 5.2,
      coordinator: 'Priya Raman', stage: 'pto', daysInStage: 9, createdDaysAgo: 96, done: ['application', 'meter', 'letter', 'activated'],
      updatesDaysAgo: [40, 9, 1],
    }),
    build({
      id: 'GW-1058', name: 'Kevin Walsh', street: '3900 Saddleback Lane', city: 'Fullerton', zip: '92835', trade: 'solar-roofing', kw: 7.4,
      coordinator: 'Priya Raman', stage: 'contract', daysInStage: 0, createdDaysAgo: 0, done: [],
      updatesDaysAgo: [0],
    }),
  ];
}
