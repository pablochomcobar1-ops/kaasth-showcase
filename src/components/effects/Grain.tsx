/** Fixed film-grain overlay (pure CSS, no JS). */
export function Grain() {
  return <div aria-hidden className="grain-overlay pointer-events-none fixed inset-0 z-30" />;
}
