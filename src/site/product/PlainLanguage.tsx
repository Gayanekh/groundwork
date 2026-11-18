import { useId, useMemo, useState } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { Avatar, Badge, Button, ChatBubble, Panel, Reveal, SectionTag } from '@/design-system';
import { findJargon, replaceJargon, type JargonHit } from '@/app/domain/plainLanguage';

const SAMPLE = 'Hi Maria, the AHJ approved your plan set! Next we schedule install, then inspection, then we apply for PTO with the utility.';

/** A draft message in a bubble. Words a homeowner may not know are highlighted; tap one to say it plainly. */
export function PlainLanguageDemo() {
  const [text, setText] = useState(SAMPLE);
  const hits = useMemo(() => findJargon(text), [text]);
  const parts: Array<string | JargonHit> = [];
  let cursor = 0;
  for (const h of hits) {
    if (h.index > cursor) parts.push(text.slice(cursor, h.index));
    parts.push(h);
    cursor = h.index + h.match.length;
  }
  parts.push(text.slice(cursor));
  const unique = new Set(hits.map((h) => h.term.toLowerCase())).size;

  return (
    <div className="mx-auto w-full max-w-3xl rounded-3xl bg-paper-raised p-5 text-ink-primary shadow-float sm:p-8">
      <div className="flex items-center gap-3">
        <Avatar name="Maria Delgado" size="lg" decorative />
        <div>
          <p className="text-md font-semibold tracking-tight">Message to Maria</p>
          <p className="text-sm text-ink-tertiary">Draft · not sent</p>
        </div>
      </div>

      <div aria-live="polite" className="mt-6">
        <ChatBubble from="team" className="max-w-full text-md sm:text-lg">
          {parts.map((p, i) =>
            typeof p === 'string' ? (
              p
            ) : (
              <button
                key={i}
                type="button"
                aria-label={`Replace ${p.match} with ${p.plain}`}
                onClick={() => setText((t) => replaceJargon(t, p.term, p.plain))}
                className="rounded-md bg-warning-bg px-1 font-medium text-warning-fg underline decoration-dotted underline-offset-4 transition-colors duration-fast ease-standard hover:bg-warning-line"
              >
                {p.match}
              </button>
            ),
          )}
        </ChatBubble>
      </div>
      <p className="mt-4 text-sm text-ink-secondary">{hits.length > 0 ? 'Tap a highlighted word to say it plainly.' : 'Every word reads clearly. Nothing here needs translating.'}</p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line-subtle pt-5">
        {hits.length > 0 ? (
          <Badge tone="warning" size="md">
            {unique} {unique === 1 ? 'word' : 'words'} a homeowner may not know
          </Badge>
        ) : (
          <Badge tone="success" size="md" icon={<Check aria-hidden="true" />}>
            Ready to send
          </Badge>
        )}
        <Button variant="ghost" size="md" leadingIcon={<RotateCcw />} onClick={() => setText(SAMPLE)}>
          Start over
        </Button>
      </div>
      <p className="mt-4 text-xs text-ink-tertiary">The same check the product runs before an update is sent. Sending is simulated.</p>
    </div>
  );
}

export function PlainLanguage() {
  const headingId = useId();
  return (
    <section id="plain" aria-labelledby={headingId} className="scroll-mt-16 px-2 sm:px-3">
      <Panel tone="dark" padding="none" className="mx-auto">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-10 sm:py-14 md:py-20">
          <SectionTag label="Plain language" ink />
          <h2 id={headingId} className="mt-8 max-w-2xl text-3xl leading-[1] font-medium tracking-[-0.03em] text-balance sm:text-4xl md:text-heading">
            Say it the way a homeowner would
          </h2>
          <p className="mt-6 max-w-lg text-md leading-snug text-ink-inverse-secondary">Every stage has a homeowner name and a plain explanation. Before an update goes out, Groundwork flags the words a homeowner may not know. Try it.</p>
          <Reveal className="mt-12">
            <PlainLanguageDemo />
          </Reveal>
        </div>
      </Panel>
    </section>
  );
}
