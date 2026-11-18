import { useLayoutEffect, type ReactNode } from 'react';
import type { Preview } from '@storybook/react-vite';
import { ToastProvider } from '../src/design-system';
import '../src/styles/index.css';

type Surface = 'mist' | 'warm';

/** Sets the surface on <html> (like the app does) so portals, menus and dialogs match the story. */
function SurfaceScope({ surface, children }: { surface: Surface; children: ReactNode }) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (surface === 'mist') root.setAttribute('data-surface', 'mist');
    else root.removeAttribute('data-surface');
    document.body.style.background = 'var(--color-paper-base)';
  }, [surface]);
  return <>{children}</>;
}

const preview: Preview = {
  globalTypes: {
    surface: {
      description: 'Surface the components sit on',
      toolbar: {
        title: 'Surface',
        icon: 'paintbrush',
        dynamicTitle: true,
        items: [
          { value: 'mist', title: 'Mist (cool, used by the site and the app)' },
          { value: 'warm', title: 'Warm paper (default tokens)' },
        ],
      },
    },
  },
  initialGlobals: { surface: 'mist' },
  decorators: [
    (Story, context) => (
      <SurfaceScope surface={(context.globals.surface as Surface) ?? 'mist'}>
        <ToastProvider>
          <div className="font-sans text-ink-primary">
            <Story />
          </div>
        </ToastProvider>
      </SurfaceScope>
    ),
  ],
  parameters: {
    layout: 'padded',
    backgrounds: { disabled: true },
    controls: { expanded: true, sort: 'requiredFirst' },
    // axe-core runs on every story; violations show in the Accessibility panel.
    a11y: { test: 'todo' },
    options: {
      storySort: { order: ['Introduction', 'Foundations', 'Components', 'Product patterns'] },
    },
  },
  tags: ['autodocs'],
};

export default preview;
