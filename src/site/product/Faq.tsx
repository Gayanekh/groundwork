import { useId, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Reveal, SectionTag, cx } from '@/design-system';

const ITEMS = [
  { q: 'What is Groundwork?', a: 'An independent speculative product concept: a working prototype of a post-sale project-operations tool for home-energy installers.' },
  { q: 'Is it a real product or company?', a: 'No. It has no customers, pricing or backend. It is an independent concept that exists to explore how product design and design engineering fit together.' },
  { q: 'Who is it designed for?', a: 'Project coordinators, who see what needs them each day. Homeowners are the second audience: they receive plain-language updates but never log in.' },
  { q: 'Are the messages really sent?', a: 'No. Sending is simulated, and nothing leaves your browser. Every person, address and number in the prototype is fictional.' },
  { q: 'Where is my data kept?', a: 'In your own browser only. Use the workspace menu in the prototype to reset the demo data at any time.' },
];

export function Faq() {
  const headingId = useId();
  const base = useId();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" aria-labelledby={headingId} className="scroll-mt-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-10 sm:py-14 md:py-20 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionTag label="FAQ" />
          <h2 id={headingId} className="mt-8 max-w-md text-3xl leading-[1] font-medium tracking-[-0.03em] text-balance sm:text-4xl md:text-heading">
            Questions, answered clearly
          </h2>
          <p className="mt-6 max-w-sm text-md leading-snug text-ink-secondary">Short answers about what Groundwork is, and what it is not.</p>
        </div>

        <ul>
          {ITEMS.map((it, i) => {
            const isOpen = open === i;
            const buttonId = `${base}-q${i}`;
            const panelId = `${base}-a${i}`;
            return (
              <Reveal as="li" key={it.q} delay={i * 0.05} className="border-b border-line-default first:border-t">
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex min-h-16 w-full items-center gap-4 py-5 text-left"
                  >
                    <span aria-hidden="true" className={cx('w-9 shrink-0 text-lg tabular transition-colors duration-base ease-standard', isOpen ? 'text-ember-600' : 'text-ink-tertiary')}>
                      0{i + 1}.
                    </span>
                    <span className="flex-1 text-lg font-medium tracking-tight sm:text-xl">{it.q}</span>
                    <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-paper-inverse text-ink-inverse pointer-coarse:size-11 [&_svg]:size-4">
                      {isOpen ? <Minus /> : <Plus />}
                    </span>
                  </button>
                </h3>
                <div id={panelId} role="region" aria-labelledby={buttonId} aria-hidden={!isOpen} className={cx('grid transition-[grid-template-rows,opacity] duration-slow ease-out', isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
                  <div className="overflow-hidden">
                    <p className="max-w-lg pr-12 pb-6 pl-13 text-base text-ink-secondary">{it.a}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
