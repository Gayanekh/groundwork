import type { Health } from '@/app/domain/types';

export const DISCLAIMER = 'Independent Speculative Concept.';

/** Sections of the page, in order. Drives the header menu. */
export const SECTIONS = [
  { id: 'top', label: 'Introduction' },
  { id: 'problem', label: 'Problem' },
  { id: 'solution', label: 'Solution' },
  { id: 'how', label: 'How it works' },
  { id: 'features', label: 'Features' },
  { id: 'product', label: 'Product' },
  { id: 'results', label: 'Results' },
  { id: 'plain', label: 'Plain language' },
  { id: 'faq', label: 'FAQ' },
  { id: 'start', label: 'Try it' },
] as const;

/** Fictional projects shown on the phone screens. */
export interface QueueRow {
  id: string;
  name: string;
  stage: string;
  health: Health;
  reason: string;
}

export const MARIA_BLOCKED: QueueRow = { id: 'maria', name: 'Maria Delgado', stage: 'Permitting', health: 'blocked', reason: 'Blocked 6 days · waiting on engineer' };
export const DEVON: QueueRow = { id: 'devon', name: 'Devon Park', stage: 'Site survey', health: 'at-risk', reason: 'No homeowner update in 9 days' };
export const PRIYA: QueueRow = { id: 'priya', name: 'Priya Nair', stage: 'Inspection', health: 'on-track', reason: 'Inspection booked Thursday' };
export const TOM: QueueRow = { id: 'tom', name: 'Tom Becker', stage: 'Final design', health: 'on-track', reason: 'Design review on schedule' };
