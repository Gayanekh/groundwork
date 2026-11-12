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
    const groups = ['paper', 'ink', 'line', 'ember', 'success', 'warning', 'danger', 'info', 'neutral'];
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
