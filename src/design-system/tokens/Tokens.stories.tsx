import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { tokens } from './tokens';

const meta = {
  title: 'Foundations/Tokens',
  parameters: { layout: 'padded', docs: { description: { component: 'Rendered directly from the generated `tokens.ts`, so this page can never drift from code.' } } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const entries = (prefix: string) => Object.entries(tokens).filter(([k]) => k.startsWith(prefix)) as Array<[string, unknown]>;

export const Color: Story = {
  render: () => {
    const groups = ['paper', 'ink', 'line', 'core', 'mist', 'wash', 'ember', 'success', 'warning', 'danger', 'info', 'neutral'];
    return (
      <div className="space-y-8">
        {groups.map((g) => (
          <section key={g}>
            <h3 className="mb-3 font-mono text-sm font-medium">color.{g}</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {entries(`color.${g}.`).map(([k, v]) => (
                <div key={k} className="overflow-hidden rounded-md border border-line-default bg-paper-raised">
                  <div className="h-14" style={{ background: String(v) }} />
                  <div className="px-2 py-1.5 font-mono text-2xs">
                    <div>{k.replace('color.', '')}</div>
                    <div className="text-ink-tertiary uppercase">{String(v)}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  },
};

// The page itself sits on the core or mist surface, so the warm card sets the original values itself.
const warm = {
  '--color-paper-base': tokens['color.paper.base'],
  '--color-paper-sunken': tokens['color.paper.sunken'],
  '--color-paper-inverse': tokens['color.paper.inverse'],
  '--color-ink-primary': tokens['color.ink.primary'],
  '--color-ink-secondary': tokens['color.ink.secondary'],
  '--color-ink-tertiary': tokens['color.ink.tertiary'],
  '--color-line-subtle': tokens['color.line.subtle'],
  '--color-line-default': tokens['color.line.default'],
  '--font-sans': tokens['font.sans'],
  '--radius-lg': tokens['radius.lg'],
  '--radius-2xl': tokens['radius.2xl'],
  '--radius-3xl': tokens['radius.3xl'],
} as CSSProperties;

export const Surfaces: Story = {
  parameters: { docs: { description: { story: 'The same components on warm paper (the default tokens), the neutral core surface (the landing page, case study and app) and the cool mist surface. A surface is switched on with `data-surface="core"` or `data-surface="mist"`.' } } },
  render: () => (
    <div className="grid gap-4 lg:grid-cols-3">
      {[
        { name: 'Warm paper (default tokens)', surface: undefined, style: warm },
        { name: 'Core (site, case study, app)', surface: 'core', style: undefined },
        { name: 'Mist (earlier look)', surface: 'mist', style: undefined },
      ].map(({ name, surface, style }) => (
        <div key={name} data-surface={surface} style={style} className="rounded-3xl bg-paper-base p-6 ring-1 ring-line-default">
          <p className="font-mono text-xs text-ink-tertiary">{name}</p>
          <p className="mt-3 text-3xl leading-none font-medium tracking-[-0.03em]">Signed to switched on</p>
          <div className="mt-5 rounded-2xl border border-line-subtle bg-paper-raised p-4">
            <p className="font-semibold">Maria Delgado</p>
            <p className="text-sm text-ink-secondary">Permitting · 26d of 21d target</p>
          </div>
          <div className="mt-4 flex gap-2">
            <span className="rounded-md bg-paper-inverse px-3 py-1.5 text-sm text-ink-inverse">paper.inverse</span>
            <span className="rounded-md bg-paper-sunken px-3 py-1.5 text-sm">paper.sunken</span>
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div className="space-y-3">
      {entries('text.').map(([k, v]) => {
        const val = v as { fontSize: string; lineHeight: string };
        return (
          <div key={k} className="flex items-baseline gap-6 border-b border-line-subtle pb-3">
            <span className="w-28 shrink-0 font-mono text-xs text-ink-tertiary">
              {k} · {val.fontSize}
            </span>
            <span style={{ fontSize: val.fontSize, lineHeight: val.lineHeight }}>Approval to turn on</span>
          </div>
        );
      })}
      <div className="grid gap-3 pt-4 sm:grid-cols-3">
        {entries('font.').map(([k, v]) => (
          <div key={k} className="rounded-md border border-line-default bg-paper-raised p-4">
            <p className="font-mono text-xs text-ink-tertiary">{k}</p>
            <p className="mt-2 text-2xl" style={{ fontFamily: String(v) }}>
              Groundwork 1048
            </p>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const RadiusShadowMotion: Story = {
  name: 'Radius, shadow & motion',
  render: () => (
    <div className="space-y-10">
      <div className="flex flex-wrap gap-4">
        {entries('radius.').map(([k, v]) => (
          <div key={k} className="text-center">
            <div className="size-20 border border-line-strong bg-paper-raised" style={{ borderRadius: String(v) }} />
            <p className="mt-2 font-mono text-2xs">
              {k} · {String(v)}
            </p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-6">
        {entries('shadow.').map(([k, v]) => (
          <div key={k} className="text-center">
            <div className="size-24 rounded-lg bg-paper-raised" style={{ boxShadow: String(v) }} />
            <p className="mt-2 font-mono text-2xs">{k}</p>
          </div>
        ))}
      </div>
      <table className="text-sm">
        <tbody>
          {[...entries('duration.'), ...entries('ease.'), ...entries('breakpoint.'), ...entries('spacing.')].map(([k, v]) => (
            <tr key={k} className="border-b border-line-subtle">
              <td className="py-1.5 pr-8 font-mono text-xs">{k}</td>
              <td className="py-1.5 font-mono text-xs text-ink-secondary">{String(v)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};
