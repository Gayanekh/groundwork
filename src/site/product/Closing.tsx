import { useId } from 'react';
import { ArrowRight } from 'lucide-react';
import { Panel, Reveal, SectionTag, buttonStyles } from '@/design-system';
import { Link } from '@/app/router';
import { Photo } from './Photo';
import { PHOTOS } from './images';

export function Closing() {
  const headingId = useId();
  return (
    <section id="start" aria-labelledby={headingId} className="scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-10 sm:pb-14 md:pb-20">
        <Reveal>
          <Panel tone="wash" padding="lg">
            <div className="grid items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <SectionTag label="Try it" />
                <h2 id={headingId} className="mt-8 text-3xl leading-[1] font-medium tracking-[-0.03em] sm:text-4xl text-balance md:text-heading">
                  Get every project switched on
                </h2>
                <p className="mt-6 max-w-md text-md leading-snug text-ink-secondary">Open the working prototype and take the stalled-permit journey yourself, from the Today queue to the update Maria reads. Everything in it is fictional, and nothing is really sent.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/app" className={buttonStyles({ variant: 'primary', size: 'lg', pill: true, press: true })}>
                    Try the prototype <ArrowRight aria-hidden="true" />
                  </Link>
                  <Link to="/" className={buttonStyles({ variant: 'secondary', size: 'lg', pill: true, press: true })}>
                    Read the case study
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-5">
                <Photo photo={PHOTOS.installers} />
              </div>
            </div>
          </Panel>
        </Reveal>
      </div>
    </section>
  );
}
