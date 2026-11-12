import { BLOCKER_CATEGORY, STAGE_BY_ID, TRADE_HOMEOWNER } from './stages';
import { openBlockers } from './health';
import type { Project } from './types';

/**
 * Industry jargon that homeowners commonly do not know, with plain replacements.
 * Matching is whole-word and case-insensitive.
 */
export const JARGON: ReadonlyArray<{ term: string; plain: string }> = [
  { term: 'AHJ', plain: 'city permit office' },
  { term: 'PTO', plain: 'approval to turn on your system' },
  { term: 'permission to operate', plain: 'approval to turn on your system' },
  { term: 'interconnection', plain: 'connection to the power grid' },
  { term: 'NEM', plain: 'net metering (credits for extra power)' },
  { term: 'MPU', plain: 'electrical panel upgrade' },
  { term: 'plan set', plain: 'system plans' },
  { term: 'stipulation', plain: 'document request' },
  { term: 'stip', plain: 'document request' },
  { term: 'racking', plain: 'mounting hardware' },
  { term: 'change order', plain: 'update to your agreement' },
  { term: 'TSRF', plain: 'sun exposure' },
  { term: 'meter swap', plain: 'new utility meter' },
];

export interface JargonHit {
  term: string;
  plain: string;
  index: number;
  match: string;
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Find jargon in a message. Longer terms win over shorter overlapping ones ("plan set" before "set"). */
export function findJargon(text: string): JargonHit[] {
  const hits: JargonHit[] = [];
  const taken: Array<[number, number]> = [];
  const sorted = [...JARGON].sort((a, b) => b.term.length - a.term.length);
  for (const { term, plain } of sorted) {
    const re = new RegExp(`\\b${escape(term)}\\b`, 'gi');
    for (const m of text.matchAll(re)) {
      const start = m.index ?? 0;
      const end = start + m[0].length;
      if (taken.some(([s, e]) => start < e && end > s)) continue;
      taken.push([start, end]);
      hits.push({ term, plain, index: start, match: m[0] });
    }
  }
  return hits.sort((a, b) => a.index - b.index);
}

/** Replace one jargon term (all occurrences) with its plain-language version. */
export function replaceJargon(text: string, term: string, plain: string) {
  return text.replace(new RegExp(`\\b${escape(term)}\\b`, 'gi'), plain);
}

export type TemplateId = 'progress' | 'delay' | 'action';

export const TEMPLATES: ReadonlyArray<{ id: TemplateId; label: string }> = [
  { id: 'progress', label: 'Progress update' },
  { id: 'delay', label: 'Delay notice' },
  { id: 'action', label: 'Action needed' },
];

const firstName = (full: string) => full.split(' ')[0];

/** Draft a homeowner message from project state. The coordinator always reviews before sending. */
export function draftMessage(p: Project, template: TemplateId): string {
  const stage = STAGE_BY_ID[p.stage];
  const name = firstName(p.homeowner.name);
  const what = TRADE_HOMEOWNER[p.trade];
  const sign = `— ${firstName(p.coordinator)}, Brightline Home Energy`;
  const blocker = openBlockers(p)[0];

  if (template === 'delay') {
    const reason = blocker ? BLOCKER_CATEGORY[blocker.category].homeownerReason : 'This step is taking longer than we expected.';
    return `Hi ${name}, an honest update on your ${what} project: ${reason} We are on it and will update you again within 3 business days. Nothing is needed from you right now. ${sign}`;
  }
  if (template === 'action') {
    return `Hi ${name}, we need one quick thing from you to keep your ${what} project moving: [describe what you need]. You can reply to this message. Thank you! ${sign}`;
  }
  return `Hi ${name}, good news on your ${what} project. We are now at "${stage.homeownerLabel}". ${stage.homeownerExplainer} This usually takes ${stage.typicalDuration}. Nothing is needed from you right now. ${sign}`;
}

/** SMS segments (GSM-7 approximation: 160 chars single, 153 per segment when concatenated). */
export const smsSegments = (text: string) => (text.length <= 160 ? 1 : Math.ceil(text.length / 153));
