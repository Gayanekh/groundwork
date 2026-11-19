import type { ReactNode } from 'react';
import { Menu } from '@/design-system';

export interface TopBarProps {
  /** The logo link. Always shown. */
  brand: ReactNode;
  /** Navigation links, centered. Shown from 1280px up. */
  links?: ReactNode;
  /** Accessible name for the links navigation. */
  linksLabel?: string;
  /** Buttons on the right. Shown from 1280px up. */
  actions?: ReactNode;
  /** Menu items (MenuItem) for the hamburger menu. It replaces links and actions below 1280px. */
  menu?: ReactNode;
  /** Accessible name for the hamburger menu. */
  menuLabel?: string;
}

/**
 * The floating near-black bar at the top of the landing page, the case study and the app.
 * It is fixed in place, 24px from the top, and clears the page content with the padding each page adds.
 * Children are light text on near-black; use coreButton('light') and coreButton('outline-light') for buttons.
 */
export function TopBar({ brand, links, linksLabel = 'Primary', actions, menu, menuLabel = 'Open section menu' }: TopBarProps) {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-6 z-30 flex justify-center px-6">
      <div className="pointer-events-auto flex h-16 w-full max-w-[342px] items-center justify-between rounded-xl bg-core-ink pr-4 pl-6 font-inter text-core-chip md:max-w-[640px] xl:h-15 xl:max-w-[1120px] xl:pr-2.5">
        {brand}
        {links ? <nav aria-label={linksLabel} className="hidden items-center gap-10 xl:flex">{links}</nav> : null}
        {actions ? <div className="hidden items-center gap-2 xl:flex">{actions}</div> : null}
        {menu ? (
          <div className="xl:hidden">
            <Menu
              label="Menu"
              placement="bottom-end"
              trigger={
                <button type="button" aria-label={menuLabel} className="grid size-10 place-items-center rounded-md text-core-chip transition-opacity duration-fast hover:opacity-70">
                  <span aria-hidden="true" className="grid w-6 gap-[7px]">
                    <span className="h-px bg-current" />
                    <span className="h-px bg-current" />
                  </span>
                </button>
              }
            >
              {menu}
            </Menu>
          </div>
        ) : null}
      </div>
    </header>
  );
}
