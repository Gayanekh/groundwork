export type StageId = 'contract' | 'survey' | 'design' | 'permit' | 'install' | 'inspection' | 'pto';

export type Trade = 'solar' | 'solar-battery' | 'roofing' | 'solar-roofing';

export type BlockerCategory = 'permit' | 'utility' | 'homeowner' | 'financing' | 'materials' | 'scheduling';

export type Channel = 'sms' | 'email';

export interface ChecklistItemDef {
  id: string;
  label: string;
  required: boolean;
}

export interface StageDef {
  id: StageId;
  /** Internal (ops) name. */
  label: string;
  /** Name the homeowner sees. */
  homeownerLabel: string;
  /** One plain-language sentence explaining what happens in this stage. */
  homeownerExplainer: string;
  /** Typical duration shown to the homeowner. */
  typicalDuration: string;
  /** Days before a project in this stage is considered at risk. Illustrative values. */
  slaDays: number;
  checklist: ChecklistItemDef[];
}

export interface Blocker {
  id: string;
  category: BlockerCategory;
  title: string;
  detail?: string;
  /** Who the team is waiting on (person, office, or company). */
  waitingOn: string;
  openedAt: string;
  resolvedAt?: string;
  resolution?: string;
}

export interface HomeownerUpdate {
  id: string;
  sentAt: string;
  channel: Channel;
  message: string;
  stage: StageId;
}

export type ActivityKind = 'created' | 'stage' | 'checklist' | 'blocker-opened' | 'blocker-resolved' | 'update-sent';

export interface ActivityEvent {
  id: string;
  at: string;
  kind: ActivityKind;
  text: string;
  actor: string;
}

export interface Project {
  id: string;
  homeowner: { name: string; phone: string; email: string };
  address: { street: string; city: string; state: string; zip: string };
  trade: Trade;
  systemKw?: number;
  coordinator: string;
  preferredChannel: Channel;
  stage: StageId;
  stageEnteredAt: string;
  createdAt: string;
  /** Keyed `${stageId}.${itemId}`. */
  checklist: Record<string, boolean>;
  blockers: Blocker[];
  updates: HomeownerUpdate[];
  activity: ActivityEvent[];
}

export type Health = 'blocked' | 'at-risk' | 'on-track' | 'complete';
