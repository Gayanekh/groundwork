import { MotionConfig } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Menu, MenuItem } from '@/design-system';
import { Link, navigate } from '@/app/router';
import { LogoMark } from '@/app/layout/Logo';
import { coreButton } from './coreButton';
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
  // A floating near-black bar, like the reference: logo, a few section links, and two actions. It stays put while the page scrolls.
  return (
    <header className="pointer-events-none fixed inset-x-0 top-6 z-30 flex justify-center px-6">
      <div className="pointer-events-auto flex h-16 w-full max-w-[342px] items-center justify-between rounded-xl bg-core-ink pr-4 pl-6 font-inter text-core-chip xl:h-15 xl:max-w-[920px] xl:pr-2.5">
        <a href="#top" onClick={jumpTo('top')} aria-label="Groundwork, back to top" className="flex items-center gap-2 rounded-sm">
          <LogoMark className="size-6" />
          <span className="text-lg font-medium">Groundwork</span>
        </a>
        <nav aria-label="Sections" className="hidden items-center gap-10 xl:flex">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} onClick={jumpTo(n.id)} className="rounded-sm text-base tracking-[0.01em] whitespace-nowrap transition-opacity duration-fast hover:opacity-70">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 xl:flex">
          <Link to="/case-study" className={coreButton('outline-light')}>
            Case study
          </Link>
          <Link to="/app" className={coreButton('light', 'rounded-sm')}>
            Try the prototype <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
        <div className="xl:hidden">
          <Menu
            label="Sections"
            placement="bottom-end"
            trigger={
              <button type="button" aria-label="Open section menu" className="grid size-10 place-items-center rounded-md text-core-chip transition-opacity duration-fast hover:opacity-70">
                <span aria-hidden="true" className="grid w-6 gap-[7px]">
                  <span className="h-px bg-current" />
                  <span className="h-px bg-current" />
                </span>
              </button>
            }
          >
            {NAV.map((n) => (
              <MenuItem key={n.id} onSelect={() => scrollToId(n.id)}>
                {n.label}
              </MenuItem>
            ))}
            <MenuItem onSelect={() => navigate('/case-study')}>Case study</MenuItem>
            <MenuItem onSelect={() => navigate('/app')}>Try the prototype</MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-8 border-t border-line-default px-4 pt-10 pb-12 text-sm text-ink-secondary sm:px-10 md:grid-cols-2">
        <p className="max-w-md">
          <span className="font-medium text-ink-primary">{DISCLAIMER}</span> All people, companies, addresses and numbers in the prototype are fictional. Messages are simulated.
        </p>
        <div className="space-y-2 md:text-right">
          <p className="flex flex-wrap gap-x-5 gap-y-1 md:justify-end">
            <Link to="/case-study" className="inline-block py-3 font-medium text-ink-primary underline-offset-4 hover:underline">
              Case study
            </Link>
            <a href="/storybook/" className="inline-block py-3 font-medium text-ink-primary underline-offset-4 hover:underline">
              Storybook
            </a>
            <a href="https://github.com/Gayanekh/groundwork" className="inline-block py-3 font-medium text-ink-primary underline-offset-4 hover:underline">
              Source
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

/** The Groundwork landing page, served at "/" in the cool "mist" surface. */
export function ProductPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div data-surface="mist" className="relative min-h-dvh overflow-x-clip bg-paper-base font-sans text-pretty">
        <a href="#content" className="fixed top-2 left-2 z-[70] -translate-y-20 rounded-md bg-paper-inverse px-3 py-2 text-sm font-medium text-ink-inverse focus:translate-y-0">
          Skip to content
        </a>
        <Header />
        <main id="content">
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
