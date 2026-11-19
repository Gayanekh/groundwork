import { useLayoutEffect } from 'react';
import type { Preview } from '@storybook/react-vite';
import { ToastProvider } from '../src/design-system';
import '../src/styles/index.css';

type Surface = 'core' | 'mist' | 'warm';

/** Sets the surface on <html> (like the app does) so portals, menus and dialogs match the story. */
function SurfaceScope({ surface, children }: { surface: Surface; children: React.ReactNode }) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (surface === 'core' || surface === 'mist') root.setAttribute('data-surface', surface);
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
          { value: 'core', title: 'Core (white, neutral: the landing page, case study and app)' },
          { value: 'mist', title: 'Mist (cool blue-gray, the earlier look)' },
          { value: 'warm', title: 'Warm paper (default tokens)' },
        ],
      },
    },
  },
  initialGlobals: { surface: 'core' },
  decorators: [
    (Story, context) => (
      <SurfaceScope surface={(context.globals.surface as Surface) ?? 'core'}>
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
