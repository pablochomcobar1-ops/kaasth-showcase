# Kaasth · काष्ठ (furniture showcase)
Premium 3D furniture demo website. Concept demo by **BSX Agency**. Designed & built by BSX Agency.

## Folders
| Folder | What's inside |
|---|---|
| `docs/` | DESIGN.md (design system), tokens.css (colours, type, motion), previews/ (approved screenshots) |
| `brand-kit/` | Full logo kit: SVG/PNG logos, favicons, usage guide |
| `public/` | Files the website serves: `brand/` (logos), `audio/` (tabla loop) |
| `renders-draft/` | Draft ThreeRT hero renders (to be replaced by final renders) |

The website code (Next.js) is added in Stage 4.

## Run locally
```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit tests
npm run build      # production build check
```

## Deploy (Vercel, free)
1. Push to GitHub, then on vercel.com: **Add New → Project → Import** this repository. Framework is detected as Next.js; keep the default build settings.
2. Environment variables (Production):
   - `SITE_MODE` = `demo`
   - `NEXT_PUBLIC_SITE_URL` = the site's address, e.g. `https://kaasth-showcase.vercel.app` (no trailing slash)
3. Deploy. Every later `git push` to `main` redeploys automatically.

Going live for a real client (real enquiries by email, rate limit, Turnstile): see `docs/SECURITY.md`. Quality and security reports: `docs/QUALITY.md`, `docs/SECURITY.md`.

## Credits
- Music: "Tabla Rhythmic Raga Pulse" by Alex Morgan, Pixabay (Pixabay Content License)
- Fonts: Cormorant Garamond, Instrument Sans, Tiro Devanagari Hindi (SIL Open Font License)
- Splash Cursor: React Bits (MIT)
