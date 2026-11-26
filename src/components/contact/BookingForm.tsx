'use client';

import { useActionState, useId, useState } from 'react';
import type { ActionResult } from '@/lib/forms';
import { visitDateError } from '@/lib/visit-date';

type Action = (prev: ActionResult | null, fd: FormData) => Promise<ActionResult>;

const SLOTS = ['11:00', '13:00', '15:00', '17:00'] as const;
const INTERESTS = [
  ['heirloom', 'Heirloom pieces'], ['form', 'Modern Form pieces'], ['custom', 'Custom-made'], ['restoration', 'Restoring my own piece'], ['not-sure', 'Just looking'],
] as const;
const field = 'mt-2 w-full rounded-card border border-border bg-background px-4 py-3 text-body01 text-foreground placeholder:text-foreground-subtle focus:border-brand-accent focus:outline-none aria-[invalid=true]:border-error [color-scheme:dark]';

const prettyDate = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

/** Showroom visit booking. Uses the phone's own date picker; Mondays and out-of-range dates are flagged as soon as they are picked. */
export function BookingForm({ action, min, max, demo }: { action: Action; min: string; max: string; demo: boolean }) {
  const [state, formAction, pending] = useActionState(action, null);
  const [dateHint, setDateHint] = useState<string | null>(null);
  const [summary, setSummary] = useState('');
  const id = useId();
  const err = (k: string) => (k === 'date' && dateHint) || (state && !state.ok ? state.fieldErrors[k] : undefined);
  const Err = ({ k }: { k: string }) => (err(k) ? <p id={`${id}-${k}-err`} className="mt-2 text-body02 text-error">{err(k)}</p> : null);
  const a11y = (k: string) => ({ 'aria-invalid': err(k) ? true : undefined, 'aria-describedby': err(k) ? `${id}-${k}-err` : undefined });

  if (state?.ok) {
    return (
      <div role="status" className="rounded-card border border-brand-accent/40 bg-background-tertiary p-10 text-center">
        <p lang="hi" aria-hidden="true" className="font-deva text-hero02 text-brand-accent-strong">पधारो</p>
        <p className="mt-4 text-heading02">Visit booked{demo ? ' (demo)' : ''}.</p>
        {summary && <p className="mt-3 text-body01 text-foreground">{summary}</p>}
        <p className="mt-3 text-body02 text-foreground-secondary">{demo ? 'This is a concept demo, so nothing was sent.' : 'We will call to confirm. The chai will be ready.'}</p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      noValidate
      onSubmit={(e) => { const fd = new FormData(e.currentTarget); const d = String(fd.get('date') ?? ''); const s = String(fd.get('slot') ?? ''); setSummary(d && s ? `${prettyDate(d)} at ${s}` : ''); }}
      className="grid gap-6"
    >
      <div aria-hidden="true" className="absolute -left-[9999px]"><label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-body02 text-foreground-secondary">Your name<input name="name" autoComplete="name" required className={field} {...a11y('name')} /></label>
          <Err k="name" />
        </div>
        <div>
          <label className="text-body02 text-foreground-secondary">Mobile number<input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" required className={field} {...a11y('phone')} /></label>
          <Err k="phone" />
        </div>
      </div>
      <div>
        <label className="text-body02 text-foreground-secondary">Email <span className="text-foreground-subtle">(optional)</span><input name="email" type="email" autoComplete="email" className={field} {...a11y('email')} /></label>
        <Err k="email" />
      </div>
      <div>
        <label className="text-body02 text-foreground-secondary">Visit date
          <input name="date" type="date" min={min} max={max} required className={field} {...a11y('date')}
            onChange={(e) => setDateHint(e.target.value ? visitDateError(e.target.value) : null)} />
        </label>
        <p className="mt-2 text-caption01 text-foreground-subtle">Tuesday to Sunday. We are closed on Mondays.</p>
        <Err k="date" />
      </div>
      <fieldset {...a11y('slot')}>
        <legend className="text-body02 text-foreground-secondary">Time</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {SLOTS.map((s) => (
            <label key={s} className="slot-chip">
              <input type="radio" name="slot" value={s} className="sr-only" />
              <span>{s}</span>
            </label>
          ))}
        </div>
        <Err k="slot" />
      </fieldset>
      <div>
        <label className="text-body02 text-foreground-secondary">Interested in <span className="text-foreground-subtle">(optional)</span>
          <select name="interest" defaultValue="" className={field}>
            <option value="" disabled>Choose one</option>
            {INTERESTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
      </div>
      <div>
        <label className="text-body02 text-foreground-secondary">Anything we should keep ready? <span className="text-foreground-subtle">(optional)</span>
          <textarea name="message" rows={3} maxLength={500} placeholder="A piece you saw, room size, a photo you will bring…" className={field} {...a11y('message')} />
        </label>
        <Err k="message" />
      </div>
      <div>
        <label className="flex items-start gap-3 text-body02 text-foreground-secondary">
          <input name="consent" type="checkbox" className="mt-1 size-5 accent-[var(--color-brand-accent)]" {...a11y('consent')} />
          <span>Kaasth may call or WhatsApp me to confirm this visit.</span>
        </label>
        <Err k="consent" />
      </div>
      {state && !state.ok && state.message && <p role="alert" className="text-body02 text-error">{state.message}</p>}
      <button type="submit" disabled={pending} className="justify-self-start rounded-pill bg-brand-accent px-8 py-4 text-caption01 font-medium uppercase tracking-[0.14em] text-background shadow-[var(--shadow-brass-glow)] transition-colors duration-[var(--duration-ui)] hover:bg-brand-accent-strong active:scale-[0.97] disabled:opacity-60">
        {pending ? 'Booking…' : 'Book my visit'}
      </button>
    </form>
  );
}
