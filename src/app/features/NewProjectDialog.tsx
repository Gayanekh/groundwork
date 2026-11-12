import { useRef, useState, type FormEvent } from 'react';
import { Button, Dialog, Field, Input, SegmentedControl, Select, useToast } from '@/design-system';
import { COORDINATORS } from '../data/seed';
import { TRADE_LABEL } from '../domain/stages';
import type { Channel, Trade } from '../domain/types';
import { useProjects } from '../state/ProjectsStore';
import { navigate } from '../router';

type Values = {
  homeownerName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  zip: string;
  trade: Trade | '';
  systemKw: string;
  coordinator: string;
  preferredChannel: Channel;
};

const EMPTY: Values = {
  homeownerName: '',
  phone: '',
  email: '',
  street: '',
  city: '',
  zip: '',
  trade: '',
  systemKw: '',
  coordinator: COORDINATORS[0],
  preferredChannel: 'sms',
};

type Errors = Partial<Record<keyof Values, string>>;

/** Validation messages say what to do, not just what is wrong. Exported for unit tests. */
export function validateNewProject(v: Values): Errors {
  const e: Errors = {};
  if (!v.homeownerName.trim()) e.homeownerName = 'Enter the homeowner’s full name.';
  if (!v.street.trim()) e.street = 'Enter the street address.';
  if (!v.city.trim()) e.city = 'Enter the city.';
  if (!/^\d{5}$/.test(v.zip.trim())) e.zip = 'Use a 5-digit ZIP code, like 92831.';
  if (!v.trade) e.trade = 'Choose what is being installed.';
  if (v.preferredChannel === 'sms' && v.phone.replace(/\D/g, '').length !== 10) e.phone = 'Enter a 10-digit phone number to send text updates.';
  if (v.preferredChannel === 'email' && !/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = 'Enter an email address to send email updates.';
  if (v.email.trim() && !/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = 'This email address looks incomplete.';
  if (v.systemKw && !(Number(v.systemKw) > 0 && Number(v.systemKw) < 100)) e.systemKw = 'Enter a size between 0.1 and 99.9 kW.';
  return e;
}

export function NewProjectDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { createProject } = useProjects();
  const toast = useToast();
  const [v, setV] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const firstRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    const next = { ...v, [key]: value };
    setV(next);
    // After the first submit attempt, re-validate live so errors clear as the user fixes them.
    if (submitted) setErrors(validateNewProject(next));
  };

  const close = () => {
    onClose();
    // reset after exit animation
    window.setTimeout(() => {
      setV(EMPTY);
      setErrors({});
      setSubmitted(false);
    }, 250);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validateNewProject(v);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      // Move focus to the first invalid field.
      window.requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    const project = createProject({
      ...v,
      trade: v.trade as Trade,
      systemKw: v.systemKw ? Number(v.systemKw) : undefined,
    });
    close();
    toast({
      title: `${project.id} created`,
      description: `${project.homeowner.name} is now in Contract.`,
      action: { label: 'Open', onClick: () => navigate(`/app/projects/${project.id}`) },
    });
  };

  const errorCount = Object.keys(errors).length;
  const isRoofing = v.trade === 'roofing';

  return (
    <Dialog
      open={open}
      onClose={close}
      title="New project"
      description="Start tracking a signed contract. You can add details later."
      size="lg"
      initialFocus={firstRef}
      dismissOnOverlay={false}
      footer={
        <>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="new-project-form">
            Create project
          </Button>
        </>
      }
    >
      <form id="new-project-form" ref={formRef} noValidate onSubmit={submit} className="space-y-6 pb-4">
        {submitted && errorCount > 0 && (
          <p role="alert" className="rounded-md border border-danger-line bg-danger-bg px-3 py-2 text-sm text-danger-fg">
            Please fix {errorCount} field{errorCount === 1 ? '' : 's'} below.
          </p>
        )}
        <fieldset className="space-y-4">
          <legend className="mb-3 text-2xs font-semibold tracking-wider text-ink-tertiary uppercase">Homeowner</legend>
          <Field label="Full name" required error={errors.homeownerName}>
            <Input ref={firstRef} autoComplete="off" value={v.homeownerName} onChange={(e) => set('homeownerName', e.target.value)} placeholder="e.g. Jordan Rivera" />
          </Field>
          <Field label="Preferred updates by" required hint="Homeowner updates will default to this channel.">
            <SegmentedControl<Channel>
              label="Preferred update channel"
              className="self-start"
              value={v.preferredChannel}
              onChange={(c) => set('preferredChannel', c)}
              options={[
                { value: 'sms', label: 'Text message' },
                { value: 'email', label: 'Email' },
              ]}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Mobile phone" required={v.preferredChannel === 'sms'} optional={v.preferredChannel !== 'sms'} error={errors.phone}>
              <Input type="tel" inputMode="tel" autoComplete="off" value={v.phone} onChange={(e) => set('phone', e.target.value)} placeholder="(714) 555-0100" />
            </Field>
            <Field label="Email" required={v.preferredChannel === 'email'} optional={v.preferredChannel !== 'email'} error={errors.email}>
              <Input type="email" autoComplete="off" value={v.email} onChange={(e) => set('email', e.target.value)} placeholder="name@example.com" />
            </Field>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="mb-3 text-2xs font-semibold tracking-wider text-ink-tertiary uppercase">Property</legend>
          <Field label="Street address" required error={errors.street}>
            <Input autoComplete="off" value={v.street} onChange={(e) => set('street', e.target.value)} placeholder="1200 Example Street" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-[1fr_9rem]">
            <Field label="City" required error={errors.city}>
              <Input autoComplete="off" value={v.city} onChange={(e) => set('city', e.target.value)} />
            </Field>
            <Field label="ZIP code" required error={errors.zip}>
              <Input inputMode="numeric" maxLength={5} value={v.zip} onChange={(e) => set('zip', e.target.value.replace(/\D/g, ''))} />
            </Field>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="mb-3 text-2xs font-semibold tracking-wider text-ink-tertiary uppercase">Project</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Trade" required error={errors.trade}>
              <Select<Trade>
                value={v.trade || undefined}
                onChange={(t) => set('trade', t)}
                placeholder="Choose trade"
                options={(Object.keys(TRADE_LABEL) as Trade[]).map((t) => ({ value: t, label: TRADE_LABEL[t] }))}
              />
            </Field>
            <Field label="System size" optional error={errors.systemKw} hint={isRoofing ? 'Not needed for roofing-only projects.' : 'In kilowatts (kW).'}>
              <Input
                inputMode="decimal"
                disabled={isRoofing}
                value={isRoofing ? '' : v.systemKw}
                onChange={(e) => set('systemKw', e.target.value.replace(/[^\d.]/g, ''))}
                trailing={<span className="pr-2 text-sm text-ink-tertiary">kW</span>}
              />
            </Field>
          </div>
          <Field label="Coordinator" required>
            <Select value={v.coordinator} onChange={(c) => set('coordinator', c)} options={COORDINATORS.map((c) => ({ value: c, label: c }))} />
          </Field>
        </fieldset>
      </form>
    </Dialog>
  );
}
