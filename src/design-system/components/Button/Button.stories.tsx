import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, Plus, Send, Trash2, X } from 'lucide-react';
import { fn } from 'storybook/test';
import { Button } from './Button';
import { IconButton } from '../IconButton/IconButton';
import { Tooltip } from '../Tooltip/Tooltip';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: 'Create project', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'accent', 'secondary', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'The single action primitive. Use one `primary` per view region. `danger` only for destructive actions, ideally inside a confirm Dialog. Grows to a 44px touch target on coarse pointers. For links that look like buttons, use `buttonStyles()` on an `<a>`.',
      },
    },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { variant: 'primary' } };

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="accent">
        Accent
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="danger" leadingIcon={<Trash2 />}>
        Delete
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} size="sm" variant="primary">
        Small
      </Button>
      <Button {...args} size="md" variant="primary">
        Medium
      </Button>
      <Button {...args} size="lg" variant="primary">
        Large
      </Button>
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div className="grid max-w-xl grid-cols-[8rem_1fr] items-center gap-4 text-sm">
      <span className="text-ink-tertiary">With icons</span>
      <div className="flex gap-3">
        <Button {...args} leadingIcon={<Plus />}>
          New project
        </Button>
        <Button {...args} variant="primary" trailingIcon={<ArrowRight />}>
          Move to Installation
        </Button>
      </div>
      <span className="text-ink-tertiary">Loading</span>
      <div className="flex gap-3">
        <Button {...args} variant="primary" loading leadingIcon={<Send />}>
          Sending…
        </Button>
        <Button {...args} loading>
          Saving
        </Button>
      </div>
      <span className="text-ink-tertiary">Disabled</span>
      <div className="flex gap-3">
        <Button {...args} variant="primary" disabled>
          Move to Inspection
        </Button>
        <Button {...args} disabled>
          Secondary
        </Button>
      </div>
      <span className="text-ink-tertiary">Full width</span>
      <Button {...args} variant="primary" fullWidth>
        Create project
      </Button>
    </div>
  ),
};

export const DisabledWithReason: Story = {
  name: 'Pattern: disabled with a reason',
  render: () => (
    <div className="flex max-w-md items-center justify-between gap-4 rounded-lg border border-line-default bg-paper-raised p-4">
      <p id="why" className="text-sm text-ink-tertiary">
        Complete 1 more required checklist item first.
      </p>
      <Button variant="primary" disabled aria-describedby="why" trailingIcon={<ArrowRight />}>
        Move on
      </Button>
    </div>
  ),
  parameters: { docs: { description: { story: 'Never leave a disabled button unexplained. Show the reason as visible text and link it with `aria-describedby`.' } } },
};

export const IconButtons: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Tooltip content="Close">
        <IconButton aria-label="Close" icon={<X />} />
      </Tooltip>
      <Tooltip content="New project">
        <IconButton aria-label="New project" variant="secondary" icon={<Plus />} />
      </Tooltip>
      <IconButton aria-label="Small" size="sm" icon={<X />} />
      <IconButton aria-label="Disabled" disabled icon={<X />} />
    </div>
  ),
};
