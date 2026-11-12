import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { Field } from './Field';
import { Input, Textarea } from '../Input/Input';
import { Select } from '../Select/Select';
import { Checkbox } from '../Checkbox/Checkbox';
import { Switch } from '../Switch/Switch';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';

const meta = {
  title: 'Components/Form controls',
  component: Field,
  parameters: {
    docs: {
      description: {
        component:
          '`Field` owns label, hint, error and required state, and wires `id`, `aria-describedby` and `aria-invalid` into the control inside it. Errors say what to do ("Use a 5-digit ZIP code"), not just what is wrong.',
      },
    },
  },
  args: { label: 'Street address', children: null },
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;

export const InputStates: Story = {
  render: () => (
    <div className="grid max-w-2xl gap-5 sm:grid-cols-2">
      <Field label="Default" hint="Helper text explains format.">
        <Input placeholder="1200 Example Street" />
      </Field>
      <Field label="Required" required>
        <Input />
      </Field>
      <Field label="Optional" optional>
        <Input />
      </Field>
      <Field label="Error" required error="Use a 5-digit ZIP code, like 92831.">
        <Input defaultValue="9283" />
      </Field>
      <Field label="Disabled" hint="Not needed for roofing-only projects.">
        <Input disabled />
      </Field>
      <Field label="With adornments">
        <Input inputMode="decimal" trailing={<span className="pr-2 text-sm text-ink-tertiary">kW</span>} defaultValue="8.4" />
      </Field>
      <Field label="Search" hideLabel>
        <Input type="search" leading={<Search />} placeholder="Search projects" />
      </Field>
      <Field label="Small size">
        <Input size="sm" />
      </Field>
    </div>
  ),
};

export const TextareaField: Story = {
  name: 'Textarea',
  render: () => (
    <div className="max-w-md space-y-5">
      <Field label="How was it resolved?" required>
        <Textarea placeholder="e.g. Engineer letter uploaded to the city portal" />
      </Field>
      <Field label="Details" optional error="Keep internal notes under 500 characters.">
        <Textarea />
      </Field>
    </div>
  ),
};

const stages = [
  { value: 'contract', label: 'Contract', description: '2' },
  { value: 'survey', label: 'Site survey', description: '1' },
  { value: 'design', label: 'Final design', description: '2' },
  { value: 'permit', label: 'Permitting', description: '2' },
  { value: 'install', label: 'Installation', description: '3', disabled: true },
];

export const SelectStates: Story = {
  name: 'Select',
  render: () => (
    <div className="grid max-w-2xl gap-5 sm:grid-cols-2">
      <Field label="Stage" required>
        <Select options={stages} placeholder="Choose stage" />
      </Field>
      <Field label="With value">
        <Select options={stages} defaultValue="permit" />
      </Field>
      <Field label="Error" required error="Choose what is being installed.">
        <Select options={stages} placeholder="Choose stage" />
      </Field>
      <Field label="Disabled">
        <Select options={stages} defaultValue="survey" disabled />
      </Field>
      <div>
        <p className="mb-1.5 text-sm font-medium">Filter bar style (prefix, small)</p>
        <Select aria-label="Filter by stage" prefix="Stage" size="sm" options={[{ value: 'all', label: 'All stages' }, ...stages]} defaultValue="all" />
      </div>
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Keyboard: ↓/↑ open and move, Home/End, Enter/Space select, Esc close, type to jump. Disabled options are skipped. The list is portaled and flips upward near the viewport edge.' } },
  },
};

export const ChoiceControls: Story = {
  name: 'Checkbox, Switch, SegmentedControl',
  render: function Render() {
    const [v, setV] = useState<'all' | 'blocked' | 'risk'>('all');
    return (
      <div className="grid max-w-3xl gap-8 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-semibold">Checkbox</p>
          <Checkbox label="Permit fee paid" defaultChecked strikeWhenChecked />
          <Checkbox label="Permit approved and uploaded" strikeWhenChecked />
          <Checkbox label="Tell Maria about the progress" description="Sends a plain-language update by text." defaultChecked />
          <Checkbox label="Disabled" disabled />
        </div>
        <div className="space-y-5">
          <p className="text-sm font-semibold">Switch</p>
          <Switch label="Daily digest" description="Email me at 8 AM with projects that need attention." defaultChecked />
          <Switch label="Disabled" disabled />
          <p className="pt-2 text-sm font-semibold">SegmentedControl</p>
          <SegmentedControl
            label="Health"
            value={v}
            onChange={setV}
            options={[
              { value: 'all', label: 'All', count: 15 },
              { value: 'blocked', label: 'Blocked', count: 4 },
              { value: 'risk', label: 'At risk', count: 2 },
            ]}
          />
        </div>
      </div>
    );
  },
};
