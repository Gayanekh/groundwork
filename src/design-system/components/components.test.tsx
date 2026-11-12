import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Button, Dialog, Field, Input, Select, SegmentedControl, Switch, Tab, TabList, TabPanel, Tabs } from '../index';

describe('Button', () => {
  it('blocks clicks and announces busy while loading', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('Field + Input', () => {
  it('wires label, required, error and aria-describedby automatically', () => {
    render(
      <Field label="ZIP code" required error="Use 5 digits.">
        <Input />
      </Field>,
    );
    const input = screen.getByLabelText(/ZIP code/);
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Use 5 digits.');
  });
});

describe('Select', () => {
  const options = [
    { value: 'a', label: 'Apple' },
    { value: 'b', label: 'Banana', disabled: true },
    { value: 'c', label: 'Cherry' },
  ];

  it('opens with ArrowDown, skips disabled options and selects with Enter', async () => {
    const onChange = vi.fn();
    render(<Select aria-label="Fruit" options={options} onChange={onChange} />);
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledWith('c');
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveTextContent('Cherry');
  });

  it('closes on Escape without selecting', async () => {
    const onChange = vi.fn();
    render(<Select aria-label="Fruit" options={options} onChange={onChange} />);
    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('Tabs', () => {
  it('moves selection with arrow keys (roving tabindex)', async () => {
    render(
      <Tabs defaultValue="one">
        <TabList label="Sections">
          <Tab value="one">One</Tab>
          <Tab value="two">Two</Tab>
        </TabList>
        <TabPanel value="one">Panel one</TabPanel>
        <TabPanel value="two">Panel two</TabPanel>
      </Tabs>,
    );
    const one = screen.getByRole('tab', { name: 'One' });
    expect(one).toHaveAttribute('tabindex', '0');
    one.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel two');
  });
});

describe('Dialog', () => {
  function Harness() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Open</button>
        <Dialog open={open} onClose={() => setOpen(false)} title="Confirm" description="Are you sure?">
          <button>Inside</button>
        </Dialog>
      </>
    );
  }

  it('is labelled, traps focus inside, and closes on Escape', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByText('Open'));
    const dialog = await screen.findByRole('dialog', { name: 'Confirm' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription('Are you sure?');
    expect(dialog.contains(document.activeElement)).toBe(true);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });
});

describe('Switch & SegmentedControl', () => {
  it('Switch toggles aria-checked', async () => {
    render(<Switch label="Email digest" />);
    const sw = screen.getByRole('switch', { name: 'Email digest' });
    await userEvent.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('SegmentedControl is a radiogroup navigable with arrows', async () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl
        label="View"
        onChange={onChange}
        options={[
          { value: 'list', label: 'List' },
          { value: 'board', label: 'Board' },
        ]}
      />,
    );
    screen.getByRole('radio', { name: 'List' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith('board');
    expect(screen.getByRole('radio', { name: 'Board' })).toHaveAttribute('aria-checked', 'true');
  });
});
