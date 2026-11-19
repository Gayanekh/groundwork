import { MotionConfig } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { MenuItem } from '@/design-system';
import { Link, navigate } from '@/app/router';
import { Logo } from '@/app/layout/Logo';
import { TopBar } from '@/app/layout/TopBar';
import { coreButton } from '@/app/layout/coreButton';
import { Hero } from './Hero';
import { Problem } from './Problem';
import { Solution } from './Solution';
import { How } from './How';
import { Features } from './Features';
import { Product } from './Product';
import { Results } from './Results';
import { PlainLanguage } from './PlainLanguage';
import { Faq } from './Faq';
import { Closing } from './Closing';
import { DISCLAIMER } from './shared';
import { jumpTo, scrollToId } from './scroll';

const NAV = [
  { id: 'problem', label: 'Problem' },
  { id: 'how', label: 'How it works' },
  { id: 'features', label: 'Features' },
  { id: 'faq', label: 'FAQ' },
];

function Header() {
  // The floating bar is shared with the case study and the app (see TopBar).
  return (
    <TopBar
      brand={
        <a href="#top" onClick={jumpTo('top')} aria-label="Groundwork, back to top" className="rounded-sm">
          <Logo onDark />
        </a>
      }
      linksLabel="Sections"
      links={NAV.map((n) => (
        <a key={n.id} href={`#${n.id}`} onClick={jumpTo(n.id)} className="rounded-sm text-base tracking-[0.01em] whitespace-nowrap transition-opacity duration-fast hover:opacity-70">
          {n.label}
        </a>
      ))}
      actions={
        <>
          <Link to="/case-study" className={coreButton('outline-light')}>
            Case study
          </Link>
          <Link to="/app" className={coreButton('light', 'rounded-sm')}>
            Try the prototype <ArrowUpRight aria-hidden="true" />
          </Link>
        </>
      }
      menu={
        <>
          {NAV.map((n) => (
            <MenuItem key={n.id} onSelect={() => scrollToId(n.id)}>
              {n.label}
            </MenuItem>
          ))}
          <MenuItem onSelect={() => navigate('/case-study')}>Case study</MenuItem>
          <MenuItem onSelect={() => navigate('/app')}>Try the prototype</MenuItem>
        </>
      }
    />
  );
}

function Footer() {
  return (
    <footer className="overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-8 border-t border-line-default px-4 pt-10 pb-12 text-sm text-ink-secondary sm:px-10">
        <p className="max-w-md">
          <span className="font-medium text-ink-primary">{DISCLAIMER}</span> All people, companies, addresses and numbers in the prototype are fictional. Messages are simulated.
        </p>
      </div>
    </footer>
  );
}

/** The Groundwork landing page, served at "/" on the neutral "core" surface. */
export function ProductPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div data-surface="core" data-headings="serif" className="relative min-h-dvh overflow-x-clip bg-paper-base font-sans text-pretty">
        <a href="#content" className="fixed top-2 left-2 z-[70] -translate-y-20 rounded-md bg-paper-inverse px-3 py-2 text-sm font-medium text-ink-inverse focus:translate-y-0">
          Skip to content
        </a>
        <Header />
        <main id="content" className="divide-y divide-line-subtle">
          <Hero />
          <Problem />
          <Solution />
          <How />
          <Features />
          <Product />
          <Results />
          <PlainLanguage />
          <Faq />
          <Closing />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
