/** Two tabla drums (dayan + bayan). Decorative; the button carries the label. */
export function TablaIcon({ playing }: { playing: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4">
      <ellipse cx="7" cy="9" rx="4" ry="1.6" />
      <path d="M3 9v6c0 1 1.8 2 4 2s4-1 4-2V9" />
      <ellipse cx="17" cy="8" rx="3" ry="1.3" />
      <path d="M14 8v8c0 .8 1.3 1.5 3 1.5s3-.7 3-1.5V8" />
      {playing ? <path d="M7 4.5v1.5M17 3.5v1.5M12 3v2" strokeLinecap="round" /> : null}
    </svg>
  );
}
