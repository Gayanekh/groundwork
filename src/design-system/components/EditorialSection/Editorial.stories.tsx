import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from '../Feedback/Feedback';
import { ArrowRight, Search } from 'lucide-react';
import { Atmosphere } from '../Atmosphere/Atmosphere';
import { Avatar } from '../Avatar/Avatar';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';
import { Tab, TabList, TabPanel, Tabs } from '../Tabs/Tabs';
import { TableContainer, Table, THead, TBody, TRow, TH, TD } from '../Table/Table';
import { Panel } from '../Panel/Panel';
import { CardStack } from '../CardStack/CardStack';
import { ChatBubble } from '../ChatBubble/ChatBubble';
import { CountUp } from '../CountUp/CountUp';
import { Badge } from '../Badge/Badge';
import { Button, buttonStyles } from '../Button/Button';
import { Reveal } from '../Reveal/Reveal';
import { SpecimenFrame } from '../SpecimenFrame/SpecimenFrame';
import { ThreadRail } from '../ThreadRail/ThreadRail';
import { EditorialSection } from './EditorialSection';

const meta = {
  title: 'Components/Editorial & motion',
  component: EditorialSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Building blocks for marketing pages (the landing page at `/`). `EditorialSection` is a numbered section with a large serif heading and an optional dark band. `SpecimenFrame` shows live components like editorial photography. `Reveal` fades content in on scroll and `ThreadRail` is a scroll-linked section navigation. Motion uses the `motion` package, animates only `transform` and `opacity`, takes its easing and durations from the motion tokens, and is switched off by `prefers-reduced-motion`.',
      },
    },
  },
  args: { id: 'demo', index: '01', label: 'The silence', title: 'After the signature, the work goes quiet.' },
} satisfies Meta<typeof EditorialSection>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Section: Story = {
  args: { lede: 'A home-energy project spends most of its post-sale life waiting on someone else.' },
};

export const DarkBand: Story = {
  args: { tone: 'ink', id: 'band', index: '04', label: 'Plain language', title: 'Say it the way a homeowner would.' },
};

export const Specimen: StoryObj<typeof SpecimenFrame> = {
  render: () => (
    <div className="mx-auto max-w-2xl p-8">
      <SpecimenFrame label="Specimen 01 · One honest status" caption="Live components, not a screenshot.">
        <div className="flex items-center justify-between gap-3">
          <p className="font-semibold">Maria Delgado</p>
          <Badge tone="danger">Blocked</Badge>
        </div>
        <Alert tone="danger" title="City requested a structural letter" className="mt-4">
          Waiting on structural engineer · open 6 days
        </Alert>
      </SpecimenFrame>
    </div>
  ),
};

export const RevealOnScroll: StoryObj<typeof Reveal> = {
  render: () => (
    <div className="mx-auto max-w-xl space-y-6 p-8">
      <p className="text-sm text-ink-tertiary">Scroll down. Each block rises 14px and fades in once, 60ms apart.</p>
      <div className="h-[70vh]" />
      {[0, 1, 2].map((i) => (
        <Reveal key={i} delay={i * 0.06} className="rounded-lg border border-line-default bg-paper-raised p-6">
          Block {i + 1}
        </Reveal>
      ))}
      <div className="h-[40vh]" />
    </div>
  ),
};

export const PressFeel: StoryObj<typeof Button> = {
  render: () => (
    <div className="flex gap-3 p-8">
      <a href="#press" className={buttonStyles({ variant: 'primary', size: 'lg', press: true })}>
        Press me (scales to 97%)
      </a>
      <Button variant="secondary" size="lg" press>
        And me
      </Button>
    </div>
  ),
};

export const Thread: StoryObj<typeof ThreadRail> = {
  parameters: { docs: { description: { story: 'Visible from 1024px up. Scroll the canvas: the line fills and the active stop follows the section in view.' } } },
  render: () => (
    <>
      <ThreadRail
        label="Page sections"
        stops={[
          { id: 'one', label: 'Intro' },
          { id: 'two', label: 'Problem' },
          { id: 'three', label: 'Try it' },
        ]}
      />
      <EditorialSection id="one" index="01" label="Intro" title="First section" />
      <EditorialSection id="two" index="02" label="Problem" title="Second section" tone="ink" />
      <EditorialSection id="three" index="03" label="Try it" title="Third section" />
    </>
  ),
};

export const AtmosphereWash: StoryObj<typeof Atmosphere> = {
  parameters: { docs: { description: { story: 'Decorative hero wash. Wrap the region in `data-surface="mist"` for the cool base it fades into.' } } },
  render: () => (
    <div data-surface="mist" className="relative isolate h-[28rem] overflow-hidden bg-paper-base">
      <Atmosphere className="absolute inset-0 -z-10" />
      <div className="mx-auto max-w-3xl px-8 pt-16">
        <p className="font-serif text-5xl leading-none tracking-[-0.03em]">Signed to switched on.</p>
        <p className="mt-4 max-w-md text-md text-ink-secondary">Text stays on the pale sky and peach areas. Coral sits low, behind white cards.</p>
      </div>
    </div>
  ),
};

export const Panels: StoryObj<typeof Panel> = {
  render: () => (
    <div data-surface="mist" className="grid gap-4 bg-paper-base p-8 md:grid-cols-3">
      {(['light', 'dark', 'wash'] as const).map((tone) => (
        <Panel key={tone} tone={tone} className="aspect-4/5">
          <p className="text-lg font-medium tracking-tight">{tone} panel</p>
        </Panel>
      ))}
    </div>
  ),
};

export const Cards: StoryObj<typeof CardStack> = {
  parameters: { docs: { description: { story: 'Floating white cards offset left and right. Put live components inside; the stack is as tall as its content.' } } },
  render: () => (
    <div data-surface="mist" className="relative isolate overflow-hidden bg-paper-base p-8">
      <Atmosphere className="absolute inset-0 -z-10" parallax={false} />
      <CardStack className="mx-auto max-w-sm">
        <div>
          <p className="font-semibold">Maria Delgado</p>
          <Badge tone="danger">Blocked</Badge>
        </div>
        <Alert tone="danger" title="City requested a structural letter">
          Waiting on structural engineer
        </Alert>
        <p className="text-sm text-ink-secondary">“The city has asked us for more information.”</p>
      </CardStack>
    </div>
  ),
};

export const ChatBubbles: StoryObj<typeof ChatBubble> = {
  render: () => (
    <div data-surface="mist" className="mx-auto flex max-w-md flex-col gap-3 rounded-3xl bg-paper-raised p-6">
      <ChatBubble from="team">The AHJ approved the plan set. Next is install, then PTO.</ChatBubble>
      <ChatBubble from="homeowner">The city approved your system plans. Next we install, then we get approval to turn on your system.</ChatBubble>
    </div>
  ),
};

export const Counting: StoryObj<typeof CountUp> = {
  parameters: { docs: { description: { story: 'Counts up once, the first time it scrolls into view. Screen readers always get the final value.' } } },
  render: () => (
    <div className="p-8">
      <p className="text-8xl leading-none font-medium tracking-[-0.05em]">
        <CountUp value={26} suffix="d" duration={1.6} />
      </p>
    </div>
  ),
};

export const RefinedControls: StoryObj = {
  name: 'Refined controls (mist)',
  parameters: { docs: { description: { story: 'Tabs, inputs, buttons and tables on the mist surface: a sliding pill for the active tab, tall rounded fields with a calm focus glow, buttons that lift and nudge their arrow, and a table whose hovered row lifts into a rounded white row. Switch the toolbar Surface to Warm to compare with the original.' } } },
  render: () => (
    <div data-surface="mist" className="mx-auto max-w-4xl space-y-10 bg-paper-base p-8">
      <Tabs defaultValue="overview">
        <TabList label="Project sections">
          <Tab value="overview">Overview</Tab>
          <Tab value="blockers" count={1}>Blockers</Tab>
          <Tab value="updates" count={3}>Homeowner updates</Tab>
        </TabList>
        <TabPanel value="overview" className="pt-4 text-ink-secondary">Click a tab: the white pill slides to it.</TabPanel>
        <TabPanel value="blockers" className="pt-4 text-ink-secondary">One open blocker.</TabPanel>
        <TabPanel value="updates" className="pt-4 text-ink-secondary">Three updates sent.</TabPanel>
      </Tabs>

      <div className="flex flex-wrap gap-3">
        <Input aria-label="Search projects" placeholder="Search projects" leading={<Search />} className="w-72" />
        <Select aria-label="Stage" prefix="Stage" value="all" onChange={() => {}} className="w-60" options={[{ value: 'all', label: 'All stages' }]} />
        <Button variant="primary" size="lg" trailingIcon={<ArrowRight />}>
          Try the prototype
        </Button>
        <Button variant="secondary" size="lg">
          Read the case study
        </Button>
      </div>

      <TableContainer label="Example projects">
        <Table>
          <THead>
            <tr>
              <TH>Homeowner</TH>
              <TH>Stage</TH>
              <TH align="right">In stage</TH>
            </tr>
          </THead>
          <TBody>
            {[
              ['Maria Delgado', 'Permitting', '26d / 21d'],
              ['Rebecca Stein', 'Site survey', '9d / 7d'],
              ['Hannah Brooks', 'Final design', '7d / 5d'],
            ].map(([name, stage, days]) => (
              <TRow key={name} interactive>
                <TD>
                  <span className="flex items-center gap-3 font-semibold">
                    <Avatar name={name} size="md" decorative />
                    {name}
                  </span>
                </TD>
                <TD>{stage}</TD>
                <TD align="right" className="tabular">{days}</TD>
              </TRow>
            ))}
          </TBody>
        </Table>
      </TableContainer>
    </div>
  ),
};
