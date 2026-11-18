import type { ReactNode } from 'react';
import { cx } from '../../lib/cx';

export interface ChatBubbleProps {
  /** `team` is a grey bubble on the left. `homeowner` is an ember bubble on the right. */
  from?: 'team' | 'homeowner';
  children: ReactNode;
  className?: string;
}

/**
 * A message bubble, for showing what someone actually reads. Use it instead of a labelled box
 * when the content is a message: it reads like a conversation, not a form. Put bubbles in a
 * block container; the homeowner's bubble aligns itself to the right.
 */
export function ChatBubble({ from = 'team', children, className }: ChatBubbleProps) {
  return (
    <p
      className={cx(
        'w-fit max-w-[90%] rounded-2xl px-4 py-3 text-base leading-snug',
        from === 'team' ? 'rounded-bl-md bg-paper-sunken text-ink-primary' : 'ml-auto rounded-br-md bg-ember-600 text-white',
        className,
      )}
    >
      {children}
    </p>
  );
}
