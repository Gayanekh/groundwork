import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '@/design-system';
import { ProjectsProvider, useProjects } from '../state/ProjectsStore';
import { UpdateComposer } from './UpdateComposer';
import { HealthBadge, ProjectStepper } from './projectUi';

/**
 * Product-level patterns composed from design-system components and real domain logic.
 * Uses the illustrative seed data (fictional people and addresses).
 */
const meta = {
  title: 'Product patterns/Homeowner updates',
  decorators: [
    (Story) => (
      <ProjectsProvider latencyMs={0}>
        <Story />
      </ProjectsProvider>
    ),
  ],
  parameters: { layout: 'padded' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

function ComposerFor({ id }: { id: string }) {
  const { getProject } = useProjects();
  const p = getProject(id);
  if (!p) return null;
  return (
    <Card>
      <UpdateComposer project={p} />
    </Card>
  );
}

export const ProgressUpdateByText: Story = {
  name: 'Composer — progress update (text)',
  render: () => <ComposerFor id="GW-1039" />,
};

export const DelayNoticeByEmail: Story = {
  name: 'Composer — delay notice (email, blocked)',
  render: () => <ComposerFor id="GW-1051" />,
};

function HealthGallery() {
  const { projects } = useProjects();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <HealthBadge health="blocked" />
        <HealthBadge health="at-risk" />
        <HealthBadge health="on-track" />
        <HealthBadge health="complete" />
      </div>
      {projects.slice(0, 4).map((p) => (
        <Card key={p.id} padding="sm">
          <p className="mb-4 text-sm font-semibold">{p.homeowner.name}</p>
          <ProjectStepper project={p} />
        </Card>
      ))}
    </div>
  );
}

export const HealthAndStages: Story = {
  name: 'Health & stage stepper',
  render: () => <HealthGallery />,
};
