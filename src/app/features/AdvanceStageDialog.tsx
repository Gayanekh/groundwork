import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button, Checkbox, Dialog, useToast } from '@/design-system';
import { STAGE_BY_ID, nextStage } from '../domain/stages';
import type { Project } from '../domain/types';
import { useProjects } from '../state/ProjectsStore';
import { draftMessage } from '../domain/plainLanguage';

/**
 * Confirm moving a project forward. Confirmation exists because stage changes reset the
 * stage timer and are visible to the whole team. Optionally notifies the homeowner in the
 * same step — the moment they most want to hear from you.
 */
export function AdvanceStageDialog({ project, open, onClose }: { project: Project; open: boolean; onClose: () => void }) {
  const { advanceStage, sendUpdate } = useProjects();
  const toast = useToast();
  const [notify, setNotify] = useState(true);
  const [busy, setBusy] = useState(false);
  const next = nextStage(project.stage);
  if (!next) return null;

  const confirm = async () => {
    setBusy(true);
    advanceStage(project.id);
    if (notify) {
      // Draft against the *new* stage.
      const msg = draftMessage({ ...project, stage: next.id, blockers: [] }, 'progress');
      await sendUpdate(project.id, project.preferredChannel, msg);
    }
    setBusy(false);
    onClose();
    toast({
      title: `Moved to ${next.label}`,
      description: notify ? `Homeowner update recorded (simulated) by ${project.preferredChannel === 'sms' ? 'text' : 'email'}.` : undefined,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="sm"
      title={`Move to ${next.label}?`}
      description={`${project.homeowner.name} · ${project.id}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button variant="primary" trailingIcon={<ArrowRight />} loading={busy} onClick={confirm}>
            Move to {next.label}
          </Button>
        </>
      }
    >
      <div className="space-y-4 pb-4">
        <div className="flex items-center gap-3 rounded-md bg-paper-sunken px-4 py-3 text-sm">
          <span className="text-ink-tertiary line-through decoration-line-strong">{STAGE_BY_ID[project.stage].label}</span>
          <ArrowRight aria-hidden="true" className="size-4 text-ink-tertiary" />
          <span className="font-semibold">{next.label}</span>
          <span className="ml-auto text-xs text-ink-tertiary">target {next.slaDays}d</span>
        </div>
        <Checkbox
          checked={notify}
          onChange={(e) => setNotify(e.target.checked)}
          label={`Tell ${project.homeowner.name.split(' ')[0]} about the progress`}
          description={`Sends a plain-language “${next.homeownerLabel}” update by ${project.preferredChannel === 'sms' ? 'text' : 'email'}. Simulated.`}
        />
      </div>
    </Dialog>
  );
}
