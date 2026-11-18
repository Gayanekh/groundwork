import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Atmosphere, Badge, buttonStyles, ChatBubble, CountUp, DURATION, EASE_OUT, EditorialSection, CardStack, Panel, Reveal, SectionTag, SpecimenFrame, ThreadRail } from '../index';

describe('EditorialSection', () => {
  it('is a region named by its heading, with a running head', () => {
    render(<EditorialSection id="silence" index="01" label="The silence" title="After the signature" lede="Lede text" />);
    const region = screen.getByRole('region', { name: 'After the signature' });
    expect(region).toHaveAttribute('id', 'silence');
    expect(within(region).getByRole('heading', { level: 2 })).toHaveTextContent('After the signature');
    expect(within(region).getByText('The silence')).toBeInTheDocument();
    expect(within(region).getByText('01')).toBeInTheDocument();
  });

  it('renders the dark band when tone is ink', () => {
    render(<EditorialSection id="band" index="04" label="Plain" title="Dark" tone="ink" />);
    expect(screen.getByRole('region', { name: 'Dark' })).toHaveClass('bg-paper-inverse');
  });
});

describe('SectionTag, Panel and CardStack', () => {
  it('SectionTag shows the label and number', () => {
    render(<SectionTag label="Problem" index="01" />);
    expect(screen.getByText('Problem')).toBeInTheDocument();
    expect(screen.getByText('01')).toBeInTheDocument();
  });

  it('EditorialSection can split the tag and the heading', () => {
    render(<EditorialSection id="p" index="01" label="Problem" title="Heading" align="split" />);
    expect(screen.getByRole('region', { name: 'Heading' })).toBeInTheDocument();
  });

  it('Panel renders its content and marks decoration as hidden', () => {
    const { container } = render(
      <Panel tone="dark" as="section" aria-label="Dark panel">
        <p>Inside</p>
      </Panel>,
    );
    expect(screen.getByRole('region', { name: 'Dark panel' })).toHaveTextContent('Inside');
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('CardStack renders each child as its own card around live content', () => {
    render(
      <CardStack>
        <button type="button">First</button>
        <p>Second</p>
      </CardStack>,
    );
    expect(screen.getByRole('button', { name: 'First' })).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('buttonStyles pill makes the button fully rounded', () => {
    expect(buttonStyles({ pill: true })).toMatch(/(^|\s)rounded-full/);
    expect(buttonStyles()).not.toMatch(/(^|\s)rounded-full/);
    // On the cool surface every button is a pill without asking.
    expect(buttonStyles()).toContain('in-data-[surface=mist]:rounded-full');
  });
});

describe('SpecimenFrame', () => {
  it('is a figure with a label and a caption', () => {
    render(
      <SpecimenFrame label="Specimen 01" caption="Live components">
        <p>Inside</p>
      </SpecimenFrame>,
    );
    const fig = screen.getByRole('figure');
    expect(within(fig).getByText('Specimen 01')).toBeInTheDocument();
    expect(within(fig).getByText('Inside')).toBeInTheDocument();
    expect(within(fig).getByText('Live components').tagName).toBe('FIGCAPTION');
  });
});

describe('Reveal', () => {
  it('renders its children in the requested element', () => {
    render(
      <ul>
        <Reveal as="li">Item</Reveal>
      </ul>,
    );
    expect(screen.getByRole('listitem')).toHaveTextContent('Item');
  });
});

describe('Atmosphere', () => {
  it('is decorative: hidden from assistive tech and not interactive', () => {
    const { container } = render(<Atmosphere className="absolute inset-0" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root).toHaveClass('pointer-events-none');
    expect(root.querySelectorAll('a, button, input')).toHaveLength(0);
  });
});

describe('CountUp', () => {
  it('gives assistive tech the final value and hides the rolling digits', () => {
    const { container } = render(<CountUp value={26} suffix="d" />);
    expect(screen.getByText('26d', { selector: '.sr-only' })).toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });
});

describe('ChatBubble', () => {
  it('aligns the team bubble left and the homeowner bubble right', () => {
    render(
      <>
        <ChatBubble>From the team</ChatBubble>
        <ChatBubble from="homeowner">To the homeowner</ChatBubble>
      </>,
    );
    expect(screen.getByText('From the team')).toHaveClass('rounded-bl-md');
    expect(screen.getByText('To the homeowner')).toHaveClass('ml-auto', 'rounded-br-md');
  });
});

describe('Badge shape', () => {
  it('pill is rounded and borderless; tag keeps the compact outline', () => {
    render(
      <>
        <Badge shape="pill">Soft</Badge>
        <Badge>Compact</Badge>
      </>,
    );
    expect(screen.getByText('Soft')).toHaveClass('rounded-full', 'border-transparent');
    expect(screen.getByText('Compact')).toHaveClass('rounded-xs');
  });
});

describe('ThreadRail', () => {
  it('is a navigation of labelled links to each section', () => {
    render(
      <ThreadRail
        label="Page sections"
        stops={[
          { id: 'a', label: 'Intro' },
          { id: 'b', label: 'Problem' },
        ]}
      />,
    );
    const nav = screen.getByRole('navigation', { name: 'Page sections' });
    const links = within(nav).getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '#a');
    expect(links[1]).toHaveAccessibleName(/02 · Problem/);
  });
});

describe('motion constants and press feel', () => {
  it('are derived from the motion tokens', () => {
    expect(EASE_OUT).toEqual([0.16, 1, 0.3, 1]);
    expect(DURATION.slow).toBeCloseTo(0.28);
    expect(DURATION.slow).toBeLessThan(0.3);
  });

  it('buttonStyles adds a 97% press scale only when asked', () => {
    expect(buttonStyles({ press: true })).toContain('active:scale-[0.97]');
    expect(buttonStyles()).not.toContain('active:scale-[0.97]');
  });
});
