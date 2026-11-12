import type { Preview } from '@storybook/react-vite';
import { ToastProvider } from '../src/design-system';
import '../src/styles/index.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <ToastProvider>
        <div className="font-sans text-ink-primary">
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
  parameters: {
    layout: 'padded',
    backgrounds: {
      options: {
        paper: { name: 'paper.base', value: '#F6F4EF' },
        raised: { name: 'paper.raised', value: '#FFFFFF' },
      },
    },
    controls: { expanded: true, sort: 'requiredFirst' },
    // axe-core runs on every story; violations show in the Accessibility panel.
    a11y: { test: 'todo' },
    options: {
      storySort: { order: ['Introduction', 'Foundations', 'Components', 'Product patterns'] },
    },
  },
  initialGlobals: { backgrounds: { value: 'paper' } },
  tags: ['autodocs'],
};

export default preview;
