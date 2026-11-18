import { motion } from 'motion/react';
import { Avatar, DURATION, EASE_OUT } from '@/design-system';
import { HealthBadge } from '@/app/features/projectUi';
import type { QueueRow } from './shared';

/** The Today queue as a friendly home card: a greeting, one big sentence, then people. Rows reorder with a short layout animation. */
export function QueueCard({ rows, animate = false }: { rows: QueueRow[]; animate?: boolean }) {
  const need = rows.filter((r) => r.health !== 'on-track').length;
  return (
    <div className="w-full max-w-md rounded-3xl bg-paper-raised p-6 text-ink-primary shadow-float sm:p-8">
      <p className="text-md text-ink-secondary">Good morning, Dana</p>
      <p className="mt-1 text-3xl leading-none font-medium tracking-[-0.04em]">
        {need} {need === 1 ? 'needs' : 'need'} you today
      </p>
      <ul className="mt-7 space-y-5" aria-label="Today queue">
        {rows.map((r) => (
          <motion.li key={r.id} layout={animate ? 'position' : false} transition={{ duration: DURATION.slow, ease: EASE_OUT }} className="flex items-center gap-3.5">
            <Avatar name={r.name} size="lg" decorative />
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold">{r.name}</p>
              <p className="text-sm leading-snug text-ink-secondary">{r.reason}</p>
            </div>
            <HealthBadge health={r.health} size="sm" />
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
