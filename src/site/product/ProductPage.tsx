import { useState } from 'react';
import { MotionConfig, useMotionValueEvent, useScroll } from 'motion/react';
import { ArrowRight, Menu as MenuIcon } from 'lucide-react';
import { IconButton, Menu, MenuItem, buttonStyles, cx } from '@/design-system';
import { Link, navigate } from '@/app/router';
import { Logo } from '@/app/layout/Logo';
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
import { PHOTOS } from './images';
import { DISCLAIMER } from './shared';
import { jumpTo, scrollToId } from './scroll';

const NAV = [
  { id: 'problem', label: 'Problem' },
  { id: 'how', label: 'How it works' },
  { id: 'features', label: 'Features' },
  { id: 'product', label: 'Product' },
  { id: 'faq', label: 'FAQ' },
];

function Header() {
  // Transparent over the hero; a light frosted background appears once the page scrolls, so the links stay readable.
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));
  return (
    <>
      <header className={cx('fixed inset-x-0 top-0 z-30 border-b transition-[background-color,border-color] duration-base ease-standard', scrolled ? 'border-line-subtle/60 bg-paper-base/80 backdrop-blur-md' : 'border-transparent')}>
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-10">
          <a href="#top" onClick={jumpTo('top')} aria-label="Groundwork, back to top" className="-my-2 rounded-sm py-2">
            <Logo />
          </a>
          <nav aria-label="Sections" className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`} onClick={jumpTo(n.id)} className="rounded-full px-4 py-1.5 text-base whitespace-nowrap text-ink-primary transition-colors duration-fast ease-standard hover:bg-paper-raised/70">
                {n.label}
              </a>
            ))}
            <Link to="/case-study" className="rounded-full px-4 py-1.5 text-base font-medium whitespace-nowrap text-ink-primary transition-colors duration-fast ease-standard hover:bg-paper-raised/70">
              Case study
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Link to="/app" className={buttonStyles({ variant: 'primary', size: 'md', press: true, pill: true })}>
              Try the prototype <ArrowRight aria-hidden="true" />
            </Link>
            <div className="lg:hidden">
              <Menu label="Sections" trigger={<IconButton aria-label="Open section menu" icon={<MenuIcon />} />}>
                {NAV.map((n) => (
                  <MenuItem key={n.id} onSelect={() => scrollToId(n.id)}>
                    {n.label}
                  </MenuItem>
                ))}
                <MenuItem onSelect={() => navigate('/case-study')}>Case study</MenuItem>
              </Menu>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

function Footer() {
  const credits = Array.from(new Set(Object.values(PHOTOS).map((p) => p.photographer)));
  return (
    <footer className="overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-8 border-t border-line-default px-4 pt-10 pb-12 text-sm text-ink-secondary sm:px-10 md:grid-cols-2">
        <p className="max-w-md">
          <span className="font-medium text-ink-primary">{DISCLAIMER}</span> All people, companies, addresses and numbers in the prototype are fictional. Messages are simulated.
        </p>
        <div className="space-y-2 md:text-right">
          <p>Photographs are illustrative stock images from Unsplash by {credits.join(' and ')}. The people shown are not Groundwork customers.</p>
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
