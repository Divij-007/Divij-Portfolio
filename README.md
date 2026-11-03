# Divij P — Portfolio

Personal portfolio site for Divij P, Cloud Engineer.

**Stack**: React 18 · Vite 7 · TypeScript 5 · Tailwind CSS 3 · shadcn/ui · framer-motion

**Deployed on**: Vercel (static, SPA rewrites via `vercel.json`)

---

## Development

```bash
npm install          # install deps
npm run dev          # start dev server at http://localhost:5173
npm run build        # production build → dist/
npm run preview      # preview production build locally
npm run type-check   # tsc --noEmit (no emit, type errors only)
npm run lint         # eslint
npm run test         # vitest (run once)
npm run test:watch   # vitest (watch mode)
```

---

## Content

All site content lives in one place:

```
src/content/content.json
```

Edit this file to change any text, links, skills, certifications, experience entries, etc.
The schema is validated at startup by Zod — if you make a schema-breaking edit you'll see an error in the console.

The TypeScript types live at `src/types/content.ts`.

### Adding a new section

1. Add its id/label to `sections[]` in `content.json`
2. Add data under the relevant top-level key
3. Add a `case` to the `renderSection()` switch in `src/pages/Index.tsx`

---

## Theme

Theme tokens are set in `content.json → theme`:

| Field | Effect |
|-------|--------|
| `defaultMode` | `"dark"` / `"light"` / `"system"` |
| `accentColor` | HSL string e.g. `"173 58% 45%"` |
| `fontHeading` | Heading font name (must be imported in `index.css`) |
| `fontBody` | Body font name |
| `blurIntensity` | Backdrop blur in px (0–20) |
| `grainIntensity` | Film grain opacity in % (0–10) |
| `radius` | Base border-radius in rem |

The user's choice is persisted in `localStorage` and respects `prefers-color-scheme` on first visit.

---

## Assets

| File | Purpose |
|------|---------|
| `public/favicon.png` | Favicon |
| `public/resume.pdf` | Linked resume (set `profile.resumeUrl` in content.json) |
| `public/robots.txt` | Crawler rules |

---

## Deployment

1. Push to `main` (or merge `redesign` → `main`)
2. Vercel auto-deploys on push
3. `vercel.json` handles SPA client-side routing rewrites

### Environment variables (Phase 1)
None required.

### Environment variables (Phase 2 — Admin CMS)
See `PHASE2-SETUP.md` (added in Phase 2).

---

## Phase 2 (Admin CMS — coming)

- Supabase Auth + Postgres + Storage
- `/admin` route (noindex, auth-guarded)
- Live preview, draft/publish, CRUD for all content
- Full setup guide will be in `PHASE2-SETUP.md`
