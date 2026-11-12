import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Button, Dialog, Field, Input, Select, Textarea, useToast } from '@/design-system';
import { BLOCKER_CATEGORY } from '../domain/stages';
import type { Blocker, BlockerCategory, Project } from '../domain/types';
import { useProjects } from '../state/ProjectsStore';

export function AddBlockerDialog({ project, open, onClose }: { project: Project; open: boolean; onClose: () => void }) {
  const { addBlocker } = useProjects();
  const toast = useToast();
  const [category, setCategory] = useState<BlockerCategory | undefined>();
  const [title, setTitle] = useState('');
  const [waitingOn, setWaitingOn] = useState('');
  const [detail, setDetail] = useState('');
  const [tried, setTried] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setCategory(undefined);
      setTitle('');
      setWaitingOn('');
      setDetail('');
      setTried(false);
    }
  }, [open]);

  const errors = {
    category: !category ? 'Choose what kind of blocker this is.' : undefined,
    title: !title.trim() ? 'Describe the blocker in a few words.' : undefined,
    waitingOn: !waitingOn.trim() ? 'Who needs to act? A person, office or company.' : undefined,
  };
  const valid = !errors.category && !errors.title && !errors.waitingOn;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (!valid || !category) {
      const form = e.currentTarget as HTMLFormElement;
      window.requestAnimationFrame(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    addBlocker(project.id, { category, title: title.trim(), waitingOn: waitingOn.trim(), detail: detail.trim() || undefined });
    onClose();
    toast({ title: 'Blocker added', description: 'The project is now marked Blocked.', tone: 'info' });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Add a blocker"
      description="Anything stopping this project from moving forward."
      initialFocus={titleRef}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="add-blocker">
            Add blocker
          </Button>
        </>
      }
    >
      <form id="add-blocker" noValidate onSubmit={submit} className="space-y-4 pb-4">
        <Field label="What is blocked?" required error={tried ? errors.title : undefined}>
          <Input ref={titleRef} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Utility needs updated site plan" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category" required error={tried ? errors.category : undefined}>
            <Select<BlockerCategory>
              value={category}
              onChange={setCategory}
              placeholder="Choose category"
              options={(Object.keys(BLOCKER_CATEGORY) as BlockerCategory[]).map((c) => ({ value: c, label: BLOCKER_CATEGORY[c].label }))}
            />
          </Field>
          <Field label="Waiting on" required error={tried ? errors.waitingOn : undefined}>
            <Input value={waitingOn} onChange={(e) => setWaitingOn(e.target.value)} placeholder="e.g. City plan check" />
          </Field>
        </div>
        <Field label="Details" optional hint="Internal only. Never shown to the homeowner.">
          <Textarea rows={3} value={detail} onChange={(e) => setDetail(e.target.value)} />
        </Field>
        {category && (
          <p className="rounded-md bg-paper-sunken px-3 py-2.5 text-sm text-ink-secondary animate-fade-in">
            <span className="font-medium text-ink-primary">Homeowner wording for delay notices: </span>“{BLOCKER_CATEGORY[category].homeownerReason}”
          </p>
        )}
      </form>
    </Dialog>
  );
}

export function ResolveBlockerDialog({ project, blocker, onClose }: { project: Project; blocker: Blocker | null; onClose: () => void }) {
  const { resolveBlocker, reopenBlocker } = useProjects();
  const toast = useToast();
  const [resolution, setResolution] = useState('');
  const [tried, setTried] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (blocker) {
      setResolution('');
      setTried(false);
    }
  }, [blocker]);

  const error = tried && !resolution.trim() ? 'Add a short note so the team knows what changed.' : undefined;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (!resolution.trim()) {
      ref.current?.focus();
      return;
    }
    if (!blocker) return;
    const id = blocker.id;
    resolveBlocker(project.id, id, resolution.trim());
    onClose();
    toast({
      title: 'Blocker resolved',
      description: blocker.title,
      action: { label: 'Undo', onClick: () => reopenBlocker(project.id, id) },
    });
  };

  return (
    <Dialog
      open={Boolean(blocker)}
      onClose={onClose}
      title="Resolve blocker"
      description={blocker?.title}
      size="sm"
      initialFocus={ref}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="resolve-blocker">
            Mark resolved
          </Button>
        </>
      }
    >
      <form id="resolve-blocker" noValidate onSubmit={submit} className="pb-4">
        <Field label="How was it resolved?" required error={error}>
          <Textarea ref={ref} rows={3} value={resolution} onChange={(e) => setResolution(e.target.value)} placeholder="e.g. Engineer letter uploaded to the city portal" />
        </Field>
      </form>
    </Dialog>
  );
}
