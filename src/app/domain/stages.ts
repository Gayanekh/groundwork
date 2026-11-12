import type { BlockerCategory, StageDef, StageId, Trade } from './types';

/**
 * Post-sale lifecycle of a residential solar / roofing project.
 * Stage names reflect common industry vocabulary; SLA days are illustrative defaults,
 * not benchmarks. A real product would make them configurable per installer and region.
 */
export const STAGES: readonly StageDef[] = [
  {
    id: 'contract',
    label: 'Contract',
    homeownerLabel: 'Agreement signed',
    homeownerExplainer: 'Your agreement is signed and we are getting your project set up.',
    typicalDuration: '1–3 days',
    slaDays: 3,
    checklist: [
      { id: 'welcome', label: 'Welcome call completed', required: true },
      { id: 'financing', label: 'Financing approved', required: true },
      { id: 'bill', label: 'Recent utility bill collected', required: true },
    ],
  },
  {
    id: 'survey',
    label: 'Site survey',
    homeownerLabel: 'Home visit',
    homeownerExplainer: 'A technician visits your home to measure the roof and check your electrical panel.',
    typicalDuration: 'about 1 week',
    slaDays: 7,
    checklist: [
      { id: 'scheduled', label: 'Survey scheduled with homeowner', required: true },
      { id: 'completed', label: 'Survey completed and photos uploaded', required: true },
      { id: 'roof', label: 'Roof condition noted', required: false },
    ],
  },
  {
    id: 'design',
    label: 'Final design',
    homeownerLabel: 'System design',
    homeownerExplainer: 'Our designers finalize the exact layout of your system for your approval.',
    typicalDuration: '3–5 days',
    slaDays: 5,
    checklist: [
      { id: 'planset', label: 'Plan set drafted', required: true },
      { id: 'approved', label: 'Homeowner approved final layout', required: true },
      { id: 'changeorder', label: 'Change order signed (if layout changed)', required: false },
    ],
  },
  {
    id: 'permit',
    label: 'Permitting',
    homeownerLabel: 'City approval',
    homeownerExplainer: 'We send your plans to your city. They check that the system is safe and follows local rules.',
    typicalDuration: '2–4 weeks',
    slaDays: 21,
    checklist: [
      { id: 'submitted', label: 'Permit package submitted to AHJ', required: true },
      { id: 'fee', label: 'Permit fee paid', required: true },
      { id: 'approved', label: 'Permit approved and uploaded', required: true },
    ],
  },
  {
    id: 'install',
    label: 'Installation',
    homeownerLabel: 'Installation day',
    homeownerExplainer: 'Our crew installs your system. Most homes take one to two days.',
    typicalDuration: '1–2 weeks to schedule',
    slaDays: 10,
    checklist: [
      { id: 'materials', label: 'Materials delivered', required: true },
      { id: 'crew', label: 'Crew scheduled', required: true },
      { id: 'done', label: 'Installation completed', required: true },
      { id: 'photos', label: 'Completion photos uploaded', required: true },
    ],
  },
  {
    id: 'inspection',
    label: 'Inspection',
    homeownerLabel: 'Final inspection',
    homeownerExplainer: 'A city inspector checks the finished work. Someone may need to be home.',
    typicalDuration: '1–2 weeks',
    slaDays: 10,
    checklist: [
      { id: 'scheduled', label: 'Inspection scheduled', required: true },
      { id: 'passed', label: 'Inspection passed', required: true },
    ],
  },
  {
    id: 'pto',
    label: 'PTO',
    homeownerLabel: 'Approval to turn on',
    homeownerExplainer: 'Your utility gives final approval to connect your system to the grid. Then you can turn it on.',
    typicalDuration: '2–4 weeks',
    slaDays: 21,
    checklist: [
      { id: 'application', label: 'Interconnection application submitted', required: true },
      { id: 'meter', label: 'Meter swap completed', required: false },
      { id: 'letter', label: 'PTO letter received', required: true },
      { id: 'activated', label: 'System activated and homeowner walkthrough done', required: true },
    ],
  },
];

export const STAGE_BY_ID = Object.fromEntries(STAGES.map((s) => [s.id, s])) as Record<StageId, StageDef>;

export const stageIndex = (id: StageId) => STAGES.findIndex((s) => s.id === id);

export const nextStage = (id: StageId): StageDef | undefined => STAGES[stageIndex(id) + 1];

export const TRADE_LABEL: Record<Trade, string> = {
  solar: 'Solar',
  'solar-battery': 'Solar + battery',
  roofing: 'Roofing',
  'solar-roofing': 'Solar + roofing',
};

/** What the homeowner calls their project. */
export const TRADE_HOMEOWNER: Record<Trade, string> = {
  solar: 'solar',
  'solar-battery': 'solar and battery',
  roofing: 'new roof',
  'solar-roofing': 'roof and solar',
};

export const BLOCKER_CATEGORY: Record<BlockerCategory, { label: string; homeownerReason: string }> = {
  permit: { label: 'Permit', homeownerReason: 'The city has asked us for more information before approving your plans.' },
  utility: { label: 'Utility', homeownerReason: 'We are waiting on your utility company for the next step.' },
  homeowner: { label: 'Homeowner', homeownerReason: 'We need a quick answer from you before we can continue.' },
  financing: { label: 'Financing', homeownerReason: 'Your lender has asked for one more document.' },
  materials: { label: 'Materials', homeownerReason: 'Some equipment for your system is delayed from the supplier.' },
  scheduling: { label: 'Scheduling', homeownerReason: 'We are finding the next available date for our crew.' },
};

export const checklistKey = (stage: StageId, item: string) => `${stage}.${item}`;
