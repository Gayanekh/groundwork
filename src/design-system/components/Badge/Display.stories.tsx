import type { Meta, StoryObj } from '@storybook/react-vite';
import { CircleDot, Inbox, OctagonAlert, SearchX, TriangleAlert } from 'lucide-react';
import { Badge, StatusDot } from './Badge';
import { Avatar } from '../Avatar/Avatar';
import { Card, CardHeader } from '../Card/Card';
import { Stepper, type Step } from '../Stepper/Stepper';
import { Alert, EmptyState, Kbd, ProgressBar, Skeleton } from '../Feedback/Feedback';
import { Button } from '../Button/Button';
import { Tab, TabList, TabPanel, Tabs } from '../Tabs/Tabs';

const meta = {
  title: 'Components/Display & feedback',
  component: Badge,
  args: { children: 'Blocked' },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Badges: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge tone="danger" icon={<OctagonAlert />}>
          Blocked
        </Badge>
        <Badge tone="warning" icon={<TriangleAlert />}>
          At risk
        </Badge>
        <Badge tone="success" icon={<CircleDot />}>
          On track
        </Badge>
        <Badge tone="info" dot>
          Email
        </Badge>
        <Badge tone="accent">New</Badge>
        <Badge>Optional</Badge>
        <Badge size="sm">Small</Badge>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <StatusDot tone="success" label="Online" /> <StatusDot tone="danger" label="Blocked" pulse /> <Kbd>/</Kbd> <Kbd>Esc</Kbd>
      </div>
      <div className="flex items-center gap-2">
        {['Dana Whitfield', 'Marcus Lee', 'Priya Raman'].map((n) => (
          <Avatar key={n} name={n} />
        ))}
        <Avatar name="Brightline Home Energy" size="md" />
      </div>
    </div>
  ),
  parameters: { docs: { description: { story: 'Status is never color-only: tone + icon + text. Avatars use deterministic tones from the name.' } } },
};

const steps = (state: 'current' | 'blocked'): Step[] => [
  { id: '1', label: 'Contract', status: 'complete' },
  { id: '2', label: 'Site survey', status: 'complete' },
  { id: '3', label: 'Final design', status: 'complete', meta: 'Done Oct 17' },
  { id: '4', label: 'Permitting', status: state, meta: '26d · target 21d' },
  { id: '5', label: 'Installation', status: 'upcoming' },
  { id: '6', label: 'Inspection', status: 'upcoming' },
  { id: '7', label: 'PTO', status: 'upcoming' },
];

export const StepperStory: Story = {
  name: 'Stepper',
  render: () => (
    <div className="space-y-8">
      <Card>
        <Stepper steps={steps('current')} label="Stages" />
      </Card>
      <Card>
        <Stepper steps={steps('blocked')} label="Stages (blocked)" />
      </Card>
      <div className="flex gap-6">
        <Stepper steps={steps('current')} label="Compact" variant="compact" />
        <Stepper steps={steps('blocked')} label="Compact blocked" variant="compact" />
      </div>
    </div>
  ),
  parameters: { docs: { description: { story: 'An ordered list: screen readers hear position and status ("Permitting, current stage, blocked"). Vertical below 640px.' } } },
};

export const Feedback: Story = {
  render: () => (
    <div className="max-w-2xl space-y-4">
      <Alert tone="danger" title="This project is blocked" action={<Button size="sm">View blockers</Button>}>
        Blocked 6d: City requested a structural letter
      </Alert>
      <Alert tone="warning" title="Aisha hasn’t heard from you in 10 days">
        A short update now prevents a phone call later.
      </Alert>
      <Alert tone="success" title="Inspection passed" />
      <Alert tone="info" title="Sending is simulated in this prototype" />
      <ProgressBar value={2} max={3} label="Required items" showValue />
      <ProgressBar value={3} max={3} label="Required items" showValue tone="success" />
    </div>
  ),
};

export const EmptyAndLoading: Story = {
  name: 'Empty & loading states',
  render: () => (
    <div className="grid max-w-4xl gap-4 md:grid-cols-2">
      <Card>
        <EmptyState icon={<Inbox />} title="You’re all caught up" action={<Button size="sm">Browse all projects</Button>}>
          No blocked or at-risk projects, and every homeowner has heard from you this week.
        </EmptyState>
      </Card>
      <Card>
        <EmptyState icon={<SearchX />} title="No projects match" action={<Button size="sm">Clear filters</Button>}>
          Nothing matches “zzz” with the current filters.
        </EmptyState>
      </Card>
      <Card aria-busy="true" aria-label="Loading">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="mt-3 h-3 w-64" />
        <Skeleton className="mt-6 h-1.5 w-40" />
      </Card>
      <Card>
        <CardHeader title="Card header" description="Supporting description" actions={<Button size="sm">Action</Button>} level={3} />
        <p className="text-sm text-ink-secondary">Cards group related content on a raised surface.</p>
      </Card>
    </div>
  ),
};

export const TabsStory: Story = {
  name: 'Tabs',
  render: () => (
    <Tabs defaultValue="overview">
      <TabList label="Project sections">
        <Tab value="overview">Overview</Tab>
        <Tab value="blockers" count={1}>
          Blockers
        </Tab>
        <Tab value="updates" count={3}>
          Homeowner updates
        </Tab>
        <Tab value="activity" disabled>
          Disabled
        </Tab>
      </TabList>
      <TabPanel value="overview" className="pt-4 text-sm">
        Overview panel. Use ←/→ to switch tabs.
      </TabPanel>
      <TabPanel value="blockers" className="pt-4 text-sm">
        Blockers panel.
      </TabPanel>
      <TabPanel value="updates" className="pt-4 text-sm">
        Updates panel.
      </TabPanel>
    </Tabs>
  ),
};
