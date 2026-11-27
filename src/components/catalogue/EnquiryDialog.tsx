'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useActionState, useId, useState } from 'react';
import type { ActionResult } from '@/lib/forms';
import { Turnstile } from '@/components/forms/Turnstile';

type Action = (prev: ActionResult | null, fd: FormData) => Promise<ActionResult>;

const field = 'mt-2 w-full rounded-card border border-border bg-background px-4 py-3 text-body01 text-foreground placeholder:text-foreground-subtle focus:border-brand-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus:ring-2 focus:ring-brand-accent/30 focus-within:ring-2 focus-within:ring-brand-accent/40 aria-[invalid=true]:border-error';

/** "Enquire about this piece" button + dialog with the enquiry form (server action, works without JS too). */
export function EnquiryDialog({ action, productSlug, productName, demo }: { action: Action; productSlug: string; productName: string; demo: boolean }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(action, null);
  const id = useId();
  const err = (k: string) => (state && !state.ok ? state.fieldErrors[k] : undefined);
  const Err = ({ k }: { k: string }) => (err(k) ? <p id={`${id}-${k}-err`} className="mt-2 text-body02 text-error">{err(k)}</p> : null);
  const a11y = (k: string) => ({ 'aria-invalid': err(k) ? true : undefined, 'aria-describedby': err(k) ? `${id}-${k}-err` : undefined });

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="inline-flex items-center rounded-pill bg-brand-accent px-7 py-4 text-caption01 font-medium uppercase tracking-[0.14em] text-background shadow-[var(--shadow-brass-glow)] transition-colors duration-[var(--duration-ui)] hover:bg-brand-accent-strong active:scale-[0.97]">
        Enquire about this piece
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay fixed inset-0 z-[80] bg-background/70 backdrop-blur-sm" />
        <Dialog.Content className="dialog-panel fixed inset-x-0 bottom-0 z-[81] max-h-[92svh] overflow-y-auto rounded-t-[18px] border border-border bg-background-tertiary p-7 md:inset-auto md:left-1/2 md:top-1/2 md:w-[min(520px,92vw)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-card md:p-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <Dialog.Title className="text-heading02">Enquire about this piece</Dialog.Title>
              <Dialog.Description className="mt-2 text-body02 text-foreground-secondary">{productName}. We call back within one working day.</Dialog.Description>
            </div>
            <Dialog.Close aria-label="Close" className="inline-flex size-11 shrink-0 items-center justify-center rounded-pill border border-border text-foreground">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 1l12 12M13 1L1 13" /></svg>
            </Dialog.Close>
          </div>

          {state?.ok ? (
            <div role="status" className="py-10 text-center">
              <p lang="hi" aria-hidden="true" className="font-deva text-hero02 text-brand-accent-strong">धन्यवाद</p>
              <p className="mt-3 text-heading03">Enquiry received{demo ? ' (demo)' : ''}.</p>
              <p className="mt-2 text-body02 text-foreground-secondary">{demo ? 'This is a concept demo, so nothing was sent.' : 'We will call you within one working day.'}</p>
            </div>
          ) : (
            <form action={formAction} noValidate className="mt-8 grid gap-5">
              <input type="hidden" name="productSlug" value={productSlug} />
              <div aria-hidden="true" className="absolute -left-[9999px]">
                <label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
              </div>
              <div>
                <label className="text-body02 text-foreground-secondary">Your name
                  <input name="name" autoComplete="name" required className={field} {...a11y('name')} />
                </label>
                <Err k="name" />
              </div>
              <div>
                <label className="text-body02 text-foreground-secondary">Mobile number
                  <input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" required className={field} {...a11y('phone')} />
                </label>
                <Err k="phone" />
              </div>
              <div>
                <label className="text-body02 text-foreground-secondary">Anything we should know? <span className="text-foreground-subtle">(optional)</span>
                  <textarea name="message" rows={3} maxLength={500} placeholder="Size, finish, delivery city…" className={field} {...a11y('message')} />
                </label>
                <Err k="message" />
              </div>
              <div>
                <label className="flex items-start gap-3 text-body02 text-foreground-secondary">
                  <input name="consent" type="checkbox" className="mt-1 size-5 accent-[var(--color-brand-accent)]" {...a11y('consent')} />
                  <span>Kaasth may call or WhatsApp me about this enquiry.</span>
                </label>
                <Err k="consent" />
              </div>
              <Turnstile />
              {state && !state.ok && state.message && <p role="alert" className="text-body02 text-error">{state.message}</p>}
              <button type="submit" disabled={pending} className="mt-2 rounded-pill bg-brand-accent px-7 py-4 text-caption01 font-medium uppercase tracking-[0.14em] text-background transition-colors duration-[var(--duration-ui)] hover:bg-brand-accent-strong disabled:opacity-60">
                {pending ? 'Sending…' : 'Send enquiry'}
              </button>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
