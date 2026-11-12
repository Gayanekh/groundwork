import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Table, TableContainer, TBody, TD, TH, THead, TRow, type SortDirection } from './Table';
import { Badge } from '../Badge/Badge';

const meta = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    docs: {
      description: {
        component: 'Native `<table>` semantics with sortable headers (`aria-sort`). `TableContainer` is a keyboard-scrollable region. Below 768px products should render a card list instead.',
      },
    },
  },
} satisfies Meta<typeof Table>;
export default meta;
type Story = StoryObj<typeof meta>;

const rows = [
  { name: 'Maria Delgado', stage: 'Permitting', days: 26, health: 'Blocked' },
  { name: 'Linh Tran', stage: 'Installation', days: 3, health: 'On track' },
  { name: 'Aisha Bello', stage: 'Inspection', days: 6, health: 'At risk' },
];

export const Sortable: Story = {
  render: function Render() {
    const [sort, setSort] = useState<{ key: 'name' | 'days'; dir: SortDirection }>({ key: 'days', dir: 'desc' });
    const sorted = [...rows].sort((a, b) => (sort.key === 'name' ? a.name.localeCompare(b.name) : a.days - b.days) * (sort.dir === 'asc' ? 1 : -1));
    const toggle = (key: 'name' | 'days') => setSort((s) => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));
    return (
      <TableContainer label="Example projects">
        <Table>
          <caption className="sr-only">Example projects (fictional)</caption>
          <THead>
            <tr>
              <TH sortable sorted={sort.key === 'name' && sort.dir} onSort={() => toggle('name')}>
                Homeowner
              </TH>
              <TH>Stage</TH>
              <TH>Health</TH>
              <TH sortable sorted={sort.key === 'days' && sort.dir} onSort={() => toggle('days')} align="right">
                In stage
              </TH>
            </tr>
          </THead>
          <TBody>
            {sorted.map((r, i) => (
              <TRow key={r.name} interactive selected={i === 0}>
                <TD className="font-semibold">{r.name}</TD>
                <TD>{r.stage}</TD>
                <TD>
                  <Badge tone={r.health === 'Blocked' ? 'danger' : r.health === 'At risk' ? 'warning' : 'success'}>{r.health}</Badge>
                </TD>
                <TD align="right" className="tabular">
                  {r.days}d
                </TD>
              </TRow>
            ))}
          </TBody>
        </Table>
      </TableContainer>
    );
  },
};
