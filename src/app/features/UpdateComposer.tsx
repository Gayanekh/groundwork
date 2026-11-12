import { useMemo, useState } from 'react';
import { Mail, MessageSquareText, Send, Sparkles, WandSparkles } from 'lucide-react';
import { Alert, Avatar, Badge, Button, Field, SegmentedControl, Select, Textarea, cx, useToast } from '@/design-system';
import { draftMessage, findJargon, replaceJargon, smsSegments, TEMPLATES, type TemplateId } from '../domain/plainLanguage';
import { daysSinceHomeownerUpdate, openBlockers } from '../domain/health';
import { STAGE_BY_ID } from '../domain/stages';
import type { Channel, Project } from '../domain/types';
import { useProjects } from '../state/ProjectsStore';

const SMS_MAX = 480;

/**
 * Compose a homeowner update.
 * Key UX decisions:
 * - Draft is generated from real project state, then *edited by a human* (never auto-sent).
 * - A plain-language check flags industry jargon with one-click replacements.
 * - The preview shows exactly what the homeowner receives on their channel.
 */
export function UpdateComposer({ project, onSent }: { project: Project; onSent?: () => void }) {
  const { sendUpdate } = useProjects();
  const toast = useToast();
  const blocked = openBlockers(project).length > 0;
  const [template, setTemplate] = useState<TemplateId>(blocked ? 'delay' : 'progress');
  const [channel, setChannel] = useState<Channel>(project.preferredChannel);
  const [message, setMessage] = useState(() => draftMessage(project, blocked ? 'delay' : 'progress'));
  const [sending, setSending] = useState(false);
  const [tried, setTried] = useState(false);

  const jargon = useMemo(() => findJargon(message), [message]);
  const uniqueJargon = useMemo(() => Array.from(new Map(jargon.map((j) => [j.term.toLowerCase(), j])).values()), [jargon]);
  const segments = smsSegments(message);
  const placeholder = message.includes('[describe what you need]');

  const error = !message.trim()
    ? 'Write a message before sending.'
    : channel === 'sms' && message.length > SMS_MAX
      ? `Text messages are limited to ${SMS_MAX} characters here. Shorten it or send by email.`
      : placeholder
        ? 'Replace “[describe what you need]” with the actual request.'
        : undefined;

  const pickTemplate = (t: TemplateId) => {
    setTemplate(t);
    setMessage(draftMessage(project, t));
    setTried(false);
  };

  const send = async () => {
    setTried(true);
    if (error) return;
    setSending(true);
    await sendUpdate(project.id, channel, message.trim());
    setSending(false);
    setTried(false);
    toast({
      title: `Update recorded for ${project.homeowner.name.split(' ')[0]}`,
      description: 'Simulated: no text or email was actually delivered.',
    });
    onSent?.();
  };

  const silentDays = daysSinceHomeownerUpdate(project);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="min-w-0 space-y-5">
        {silentDays > 7 && (
          <Alert tone="warning" title={`${project.homeowner.name.split(' ')[0]} hasn’t heard from you in ${silentDays} days`}>
            Homeowners who don’t hear back tend to call in. A short update now prevents that.
          </Alert>
        )}

        <div className="flex flex-wrap items-end gap-3">
          <div className="w-full sm:w-56">
            <Field label="Start from">
              <Select<TemplateId> value={template} onChange={pickTemplate} options={TEMPLATES.map((t) => ({ value: t.id, label: t.label }))} />
            </Field>
          </div>
          <div>
            <p className="mb-1.5 text-sm font-medium text-ink-primary" id="channel-label">
              Send by
            </p>
            <SegmentedControl<Channel>
              label="Send by"
              value={channel}
              onChange={setChannel}
              options={[
                { value: 'sms', label: <><MessageSquareText aria-hidden="true" className="size-3.5" /> Text</> },
                { value: 'email', label: <><Mail aria-hidden="true" className="size-3.5" /> Email</> },
              ]}
            />
          </div>
        </div>

        <Field
          label="Message"
          required
          error={tried ? error : undefined}
          hint="Drafted from the project’s current stage. Review and edit before sending."
          aside={
            <span className={cx('text-xs tabular', channel === 'sms' && message.length > SMS_MAX ? 'text-danger-fg' : 'text-ink-tertiary')} aria-live="polite">
              {message.length}
              {channel === 'sms' ? ` / ${SMS_MAX} · ${segments} SMS` : ' chars'}
            </span>
          }
        >
          <Textarea rows={6} value={message} onChange={(e) => setMessage(e.target.value)} />
        </Field>

        <section aria-labelledby="plain-check" className="rounded-lg border border-line-default bg-paper-base p-4">
          <h3 id="plain-check" className="flex items-center gap-2 text-sm font-semibold">
            <WandSparkles aria-hidden="true" className="size-4 text-ember-600" />
            Plain-language check
            {uniqueJargon.length === 0 ? (
              <Badge tone="success" size="sm">
                Clear
              </Badge>
            ) : (
              <Badge tone="warning" size="sm">
                {uniqueJargon.length} term{uniqueJargon.length === 1 ? '' : 's'}
              </Badge>
            )}
          </h3>
          {uniqueJargon.length === 0 ? (
            <p className="mt-1.5 text-sm text-ink-tertiary">No industry jargon found. A homeowner should understand this message.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {uniqueJargon.map((j) => (
                <li key={j.term} className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-md bg-paper-raised px-3 py-2 text-sm shadow-xs">
                  <span className="min-w-0 flex-1">
                    <span className="font-mono text-xs font-medium text-warning-fg">{j.match}</span>
                    <span className="text-ink-tertiary"> → </span>
                    <span className="text-ink-primary">{j.plain}</span>
                  </span>
                  <Button size="sm" variant="secondary" onClick={() => setMessage((m) => replaceJargon(m, j.term, j.plain))} aria-label={`Replace ${j.match} with ${j.plain}`}>
                    Replace
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-1.5 text-xs text-ink-tertiary">
            <Sparkles aria-hidden="true" className="size-3.5" /> Sending is simulated in this prototype.
          </p>
          <Button variant="primary" leadingIcon={<Send />} loading={sending} onClick={send} className="max-sm:w-full">
            {sending ? 'Sending…' : `Send ${channel === 'sms' ? 'text' : 'email'}`}
          </Button>
        </div>
      </div>

      <MessagePreview project={project} channel={channel} message={message} />
    </div>
  );
}

function MessagePreview({ project, channel, message }: { project: Project; channel: Channel; message: string }) {
  const stage = STAGE_BY_ID[project.stage];
  return (
    <aside aria-label="Homeowner preview" className="min-w-0">
      <p className="mb-2 text-2xs font-semibold tracking-wider text-ink-tertiary uppercase">What {project.homeowner.name.split(' ')[0]} sees</p>
      {channel === 'sms' ? (
        <div className="rounded-[1.75rem] border border-line-default bg-paper-raised p-2 shadow-md">
          <div className="rounded-[1.4rem] bg-paper-base px-4 pt-4 pb-5">
            <div className="mb-4 flex flex-col items-center gap-1 text-center">
              <Avatar name="Brightline Home Energy" size="md" decorative />
              <span className="text-xs font-medium text-ink-secondary">Brightline Home Energy</span>
            </div>
            <div className="max-w-[88%] rounded-2xl rounded-bl-sm bg-paper-sunken px-3.5 py-2.5 text-[15px] leading-snug break-words whitespace-pre-wrap text-ink-primary">
              {message || <span className="text-ink-tertiary">Your message will appear here.</span>}
            </div>
            <p className="mt-1.5 pl-1 text-2xs text-ink-tertiary">Text message · now</p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line-default bg-paper-raised shadow-md">
          <div className="space-y-1 border-b border-line-subtle px-4 py-3 text-xs">
            <p>
              <span className="text-ink-tertiary">From </span>Brightline Home Energy
            </p>
            <p className="truncate">
              <span className="text-ink-tertiary">To </span>
              {project.homeowner.email}
            </p>
            <p className="font-semibold">Your project: {stage.homeownerLabel}</p>
          </div>
          <div className="px-4 py-4 text-sm leading-relaxed break-words whitespace-pre-wrap">{message || <span className="text-ink-tertiary">Your message will appear here.</span>}</div>
        </div>
      )}
    </aside>
  );
}
