import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from '../Feedback/Feedback';
import { Atmosphere } from '../Atmosphere/Atmosphere';
import { Panel } from '../Panel/Panel';
import { CardStack } from '../CardStack/CardStack';
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
          'Building blocks for marketing pages (`/product`). `EditorialSection` is a numbered section with a large serif heading and an optional dark band. `SpecimenFrame` shows live components like editorial photography. `Reveal` fades content in on scroll and `ThreadRail` is a scroll-linked section navigation. Motion uses the `motion` package, animates only `transform` and `opacity`, takes its easing and durations from the motion tokens, and is switched off by `prefers-reduced-motion`.',
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
