import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ArrowRight, Copy, History, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { Dialog } from './Dialog';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Menu, MenuItem, MenuLabel, MenuSeparator } from '../Menu/Menu';
import { Tooltip } from '../Tooltip/Tooltip';
import { Checkbox } from '../Checkbox/Checkbox';
import { useToast } from '../Toast/Toast';
import { Field } from '../Field/Field';
import { Input } from '../Input/Input';

const meta = {
  title: 'Components/Overlays',
  component: Dialog,
  args: { open: false, onClose: () => {}, title: 'Dialog' },
  parameters: {
    docs: {
      description: {
        component:
          'Dialog, Menu, Tooltip and Toast are portaled to `document.body` so they are never clipped. Dialog traps focus, closes on Esc, restores focus, locks scroll, and becomes a bottom sheet below 640px.',
      },
    },
  },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const ConfirmDialog: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Move to Installation
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          size="sm"
          title="Move to Installation?"
          description="Maria Delgado · GW-1048"
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" trailingIcon={<ArrowRight />} onClick={() => setOpen(false)}>
                Move to Installation
              </Button>
            </>
          }
        >
          <div className="pb-4">
            <Checkbox defaultChecked label="Tell Maria about the progress" description="Sends a plain-language update. Simulated." />
          </div>
        </Dialog>
      </>
    );
  },
};

export const FormDialog: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button leadingIcon={<Plus />} onClick={() => setOpen(true)}>
          Add blocker
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Add a blocker"
          description="Anything stopping this project from moving forward."
          dismissOnOverlay={false}
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Add blocker
              </Button>
            </>
          }
        >
          <div className="space-y-4 pb-4">
            <Field label="What is blocked?" required>
              <Input />
            </Field>
            <Field label="Waiting on" required>
              <Input />
            </Field>
          </div>
        </Dialog>
      </>
    );
  },
};

export const ActionMenu: Story = {
  name: 'Menu',
  render: () => (
    <div className="flex h-56 items-start justify-center">
      <Menu trigger={<IconButton aria-label="More actions" variant="secondary" icon={<MoreHorizontal />} />}>
        <MenuLabel>Project</MenuLabel>
        <MenuItem icon={<Plus />}>Add blocker</MenuItem>
        <MenuItem icon={<History />}>View activity</MenuItem>
        <MenuItem icon={<Copy />} hint="⌘C">
          Copy project ID
        </MenuItem>
        <MenuItem icon={<Copy />} disabled>
          Disabled item
        </MenuItem>
        <MenuSeparator />
        <MenuItem icon={<Trash2 />} tone="danger">
          Archive project
        </MenuItem>
      </Menu>
    </div>
  ),
  parameters: { docs: { description: { story: 'Keyboard: Enter/Space/↓ open and focus the first item, ↑ opens on the last, ↑/↓/Home/End move, Esc closes and returns focus.' } } },
};

export const Tooltips: Story = {
  render: () => (
    <div className="flex gap-4 py-10">
      <Tooltip content="Record what changed and reopen the path forward">
        <Button>Hover or focus me</Button>
      </Tooltip>
      <Tooltip content="Below" placement="bottom">
        <Button variant="ghost">Bottom</Button>
      </Tooltip>
    </div>
  ),
};

export const Toasts: Story = {
  render: function Render() {
    const toast = useToast();
    return (
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => toast({ title: 'Moved to Installation', description: 'Homeowner update recorded (simulated).' })}>Success</Button>
        <Button onClick={() => toast({ title: 'Blocker resolved', description: 'City requested a structural letter', action: { label: 'Undo', onClick: () => {} } })}>
          With Undo
        </Button>
        <Button onClick={() => toast({ title: 'Demo data reset', tone: 'info' })}>Info</Button>
        <Button onClick={() => toast({ title: 'Couldn’t copy', description: 'Your browser blocked clipboard access.', tone: 'danger' })}>Error</Button>
      </div>
    );
  },
  parameters: { docs: { description: { story: 'Announced via an `aria-live="polite"` region. Auto-dismiss pauses on hover and focus. Max 3 visible.' } } },
};
