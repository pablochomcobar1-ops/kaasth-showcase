/** Illustrated "old survey map" of the (fictional) showroom lane, with a red passport-stamp pin. Decorative; the address is in text beside it. */
export function SurveyMap() {
  return (
    <svg viewBox="0 0 600 380" role="img" aria-label="Map: Kaasth is in Pol no. 7, a short walk from Manek Chowk, Ahmedabad" className="block h-auto w-full rounded-card bg-paper">
      <defs>
        <pattern id="paper-lines" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#3A2418" strokeOpacity="0.05" /></pattern>
        <radialGradient id="paper-age" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stopColor="#3A2418" stopOpacity="0" /><stop offset="1" stopColor="#3A2418" stopOpacity="0.18" /></radialGradient>
      </defs>
      <rect width="600" height="380" fill="url(#paper-lines)" />
      <g fill="none" stroke="#3A2418" strokeLinecap="round">
        <path d="M-10 132 C200 120 400 108 610 96" strokeWidth="9" strokeOpacity="0.14" />
        <path d="M-10 132 C200 120 400 108 610 96" strokeWidth="1.6" strokeOpacity="0.55" />
        <path d="M-10 270 C180 248 330 300 610 256" strokeWidth="9" strokeOpacity="0.14" />
        <path d="M-10 270 C180 248 330 300 610 256" strokeWidth="1.6" strokeOpacity="0.55" />
        <path d="M150 -10 C168 120 178 250 196 390" strokeWidth="1.6" strokeOpacity="0.5" />
        <path d="M430 -10 C410 130 470 230 440 390" strokeWidth="1.6" strokeOpacity="0.5" />
        <g strokeOpacity="0.28" strokeWidth="1"><path d="M180 186 C260 182 360 176 438 172" /><path d="M268 112 C272 160 280 210 286 262" /><path d="M-10 62 L610 40" /><path d="M200 222 L300 218" /><path d="M330 120 C334 140 330 160 336 176" /><path d="M520 -10 L548 390" /><path d="M60 -10 L88 390" /></g>
      </g>
      {/* small blocks = houses of the pol */}
      <g fill="#3A2418" fillOpacity="0.08">
        <rect x="200" y="140" width="56" height="34" rx="2" /><rect x="292" y="134" width="40" height="34" rx="2" /><rect x="342" y="128" width="72" height="38" rx="2" />
        <rect x="204" y="192" width="54" height="22" rx="2" /><rect x="296" y="190" width="120" height="58" rx="2" /><rect x="460" y="120" width="50" height="90" rx="2" />
      </g>
      <g fontFamily="var(--font-sans), sans-serif" fontWeight="600" letterSpacing="2" fill="#3A2418">
        <text x="196" y="112" fontSize="10" fillOpacity="0.75">MANEK CHOWK</text>
        <text x="30" y="262" fontSize="10" fillOpacity="0.55" transform="rotate(-3 30 262)">RELIEF ROAD</text>
        <text x="300" y="300" fontSize="9" fillOpacity="0.45">TO TEEN DARWAJA →</text>
        <text x="352" y="214" fontSize="9" fillOpacity="0.5">POL NO. 7</text>
      </g>
      <g transform="translate(530 64)" stroke="#3A2418" strokeOpacity="0.6" fill="none">
        <circle r="26" /><circle r="20" strokeOpacity="0.25" />
        <path d="M0 -32 L5 0 L0 32 L-5 0Z" fill="#3A2418" fillOpacity="0.55" />
        <text x="-4" y="-36" fill="#3A2418" stroke="none" fontSize="11" fontFamily="var(--font-display), serif">N</text>
      </g>
      <g transform="translate(372 198) rotate(-10)">
        <circle r="30" fill="#9b3b2a" fillOpacity="0.06" stroke="#9b3b2a" strokeOpacity="0.85" strokeWidth="2.4" />
        <circle r="24" fill="none" stroke="#9b3b2a" strokeOpacity="0.5" strokeWidth="1" />
        <text y="-3" textAnchor="middle" fill="#9b3b2a" fontSize="10" fontWeight="700" letterSpacing="1.5" fontFamily="var(--font-sans), sans-serif">KAASTH</text>
        <text y="10" textAnchor="middle" fill="#9b3b2a" fontSize="7" letterSpacing="1" fontFamily="var(--font-sans), sans-serif">EST. 1962</text>
      </g>
      <rect width="600" height="380" fill="url(#paper-age)" />
    </svg>
  );
}
