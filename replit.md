# Tandava Tour Company

A premium 3D-animated tourism website for Tandava Tour Company, a Kerala-based tour and transportation company headquartered in Thiruvananthapuram.

Tagline: **"Pack Your Bags, We'll Do the Rest!"**

## Architecture

This is a pnpm monorepo containing:

- **artifacts/tandava** — React + Vite + Tailwind v4 frontend (the public website + admin panel). Mounted at `/`. Port: 20208.
- **artifacts/api-server** — Express API server with Drizzle/PostgreSQL, session-based admin auth, and Replit Object Storage. Port: 8080.
- **artifacts/mockup-sandbox** — Vite component preview server (used for design exploration).
- **lib/db** — Drizzle schema (packages, vehicles, gallery_images, reviews, settings, instagram_posts).
- **lib/api-spec** — OpenAPI spec (single source of truth for API contracts).
- **lib/api-client-react** — Generated React Query hooks (do not edit by hand; regenerate via codegen).
- **lib/api-zod** — Generated Zod schemas for runtime validation (do not edit by hand).
- **scripts** — One-shot scripts (e.g., DB seed).

## Frontend (artifacts/tandava)

Stack: React + Vite + Tailwind v4, wouter routing, TanStack Query, framer-motion, GSAP, Three.js / @react-three/fiber, lucide-react, react-icons, shadcn/ui.

Aesthetic: dark luxury Kerala — black backgrounds, antique gold (#C9A24A) accents, deep emerald/teal greens, ivory/cream typography. Cinematic, slow, mythic. Inspired by the Tandava (the cosmic dance of Shiva).

### Brand system

Colors (HSL via CSS vars in `src/index.css`):
- Primary — Antique Gold `#c9a227` (47 67% 47%)
- Secondary — Kerala Emerald `#0f5132` (152 69% 19%)
- Accent — Coconut Leaf Green `#1f7a63` (167 60% 30%)
- Background — Deep Black `#0b0b0b`

Fonts: **Cinzel** (headings, `font-serif`) and **Poppins** (body, `font-sans`). Loaded via Google Fonts in `index.html`.

Helper utility classes in `src/index.css`: `.glass-card`, `.glass-card-gold`, `.gold-glow`, `.text-gradient-gold`, `.tilt-card`, `.shimmer-gold`, `.pattern-leaf`, `.scrollbar-hide`. Custom premium scrollbar and `::selection` colors are also defined.

### Shared UI components

- `components/ScrollProgress.tsx` — top progress bar tied to scroll position.
- `components/FloatingActions.tsx` — bottom-right expandable FAB with WhatsApp / Call / Instagram quick actions (auto-hidden on `/admin/*`).
- `components/PageLoader.tsx` — branded splash overlay shown until `window.load`.
- `components/PageMeta.tsx` — sets per-route `<title>` and meta description (restores on unmount).
- `components/AnimatedCounter.tsx` — count-up number that triggers on viewport intersection.
- `components/TrustSection.tsx` — counters + 4 trust badges block.
- `components/ExperienceKerala.tsx` — six-card "Experience Kerala" grid.

### Public pages

`/` (Home — 3D hero with WebGL fallback, Trust counters, Experience Kerala, featured packages with badges, Instagram marquee), `/packages` (badged cards: "Popular" / "Best for Weekend" / "Family Friendly" — heuristic, no schema change), `/packages/:id`, `/fleet`, `/fleet/:id`, `/gallery` (lightbox + masonry), `/about`, `/contact` (full booking form: Name / Phone / Pickup / Destination / Date / Travellers / Notes → opens WhatsApp with prefilled message).

The Instagram section auto-scrolls horizontally, pauses on hover, supports prev/next arrow controls, and shows a "Follow @tandava_tour_company" fallback when the admin has not added any posts. Posts come from the `/api/instagram-posts` endpoint and each card opens its real Instagram URL in a new tab — no scraping, no Instagram API.

The expandable floating action button on every public page provides one-tap access to WhatsApp (`wa.me/917012393250`), phone, and Instagram.

### Admin panel (session-based)

`/admin/login` — credentials `admin / tandava2024` (configurable via `ADMIN_USERNAME` / `ADMIN_PASSWORD` env vars). Login UI shows a live countdown when locked out.
`/admin` (dashboard with live stats), `/admin/packages`, `/admin/vehicles`, `/admin/gallery`, `/admin/instagram` (Instagram posts CRUD), `/admin/reviews`, `/admin/settings`, `/admin/change-password`.

Admin pages use the same dark luxury aesthetic. All CRUD goes through generated React Query hooks. Change-password uses a direct `fetch` (not codegen) to keep the OpenAPI spec untouched.

### Image uploads

Two-step flow via Replit Object Storage:

1. `POST /api/storage/uploads/request-url` returns a presigned GCS URL + objectPath.
2. Client `PUT`s the file directly to GCS.
3. The returned `objectPath` is stored in DB (`/objects/uploads/<id>`).

Display URL: prepend `/api/storage` to objectPath. A `resolveImageUrl()` helper handles both uploaded paths and static `/generated/*` paths.

## Backend (artifacts/api-server)

Express 5 + pino-http logging + cookie-parser + express-session (HTTP-only cookies) + **helmet** security headers. All endpoints are validated against generated Zod schemas (from the OpenAPI spec).

### Security hardening

A full security audit & hardening pass was completed on **2026-04-25** (see `SECURITY.md` in the repo root for the per-section report).

- **Helmet** sets `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Strict-Transport-Security` (prod), `Referrer-Policy: strict-origin-when-cross-origin`, `X-DNS-Prefetch-Control`, COOP/CORP, etc. CSP is intentionally delegated to the Vite frontend.
- **`x-powered-by` and `etag` disabled.**
- **HTTPS redirect** — production-only middleware that 308-redirects any plain-HTTP request (trusts `X-Forwarded-Proto` from the Replit edge proxy).
- **Strict CORS** — replaces the previous `origin: true`. Allow-list comes from `ALLOWED_ORIGINS` env var or auto-derived from `REPLIT_DEV_DOMAIN` / `REPLIT_DOMAINS`.
- **Centralised error handler + JSON 404** — never leak stack traces, file paths, or DB error text. Production always returns `"Internal server error"` for 5xx.
- **No hardcoded secrets** — `lib/security.ts` and `lib/adminAuth.ts` refuse to start in production unless `SESSION_SECRET` and (`ADMIN_PASSWORD_HASH` ∨ `ADMIN_PASSWORD`) are set as Replit Secrets. Dev generates ephemeral random values and logs them with a clear warning. `.env.example` documents every required variable.
- **Bcrypt admin password** — `lib/adminAuth.ts` stores the password as a bcrypt hash (`bcryptjs`, cost 12). Min 8-char passwords enforced; `verifyAdminPassword()` uses constant-time bcrypt compare.
- **Login brute-force lockout** — per-IP attempt counter in `lib/adminAuth.ts`. **3 failed attempts within 5 minutes → 5-minute IP lockout.** Successful login resets the counter. The login response includes `lockedUntilSeconds` so the UI can show a live countdown.
- **Generic auth error** — `"Invalid username or password."` on every failure (never reveals which field was wrong).
- **Rate limiting** — `middlewares/rateLimit.ts` provides four `express-rate-limit` profiles: general API (200/min prod), admin login (10/min, failed only), write ops (60/min on every admin POST/PUT/DELETE), and uploads (30/5min).
- **File upload validation** — `lib/uploadValidation.ts` enforces image-only MIME (`jpg/jpeg/png/webp`), matching extensions, blocks executable extensions (exe/js/php/html/sh/etc.), 10 MB size cap, and filename sanitization. Upload URL endpoint also requires admin session.
- **Object-serving path traversal blocked** — `..` and absolute paths rejected on `/storage/public-objects/*` and `/storage/objects/*`.
- **`POST /admin/change-password`** (session-required, rate-limited) — validates current password (bcrypt), enforces ≥8-char new password, prevents reuse, hashes new password (cost 12), then **destroys the session and clears the cookie** so the user must re-authenticate.
- **Sessions** — `httpOnly`, `secure` in prod, `sameSite: lax`, `rolling: true` (idle expires after 7 days), custom name `tandava.sid`.
- **`.gitignore`** explicitly blocks `.env`, `.env.*`, `*.pem`, `*.key`, `logs/`, `backups/`.

### Endpoints

Public: `GET /healthz`, `GET /packages`, `GET /vehicles`, `GET /gallery`, `GET /reviews`, `GET /settings`, plus storage serve routes.

Admin (require `req.session.admin`): full CRUD for packages, vehicles, gallery, reviews, settings, instagram-posts, plus `POST /admin/login` (rate-limited), `POST /admin/logout`, `GET /admin/me`, `POST /admin/change-password`, `GET /admin/dashboard-stats`.

### Database

Tables: `packages`, `vehicles`, `gallery_images`, `reviews`, `settings`, `instagram_posts`. Schema lives in `lib/db/src/schema/`. Push changes with `pnpm --filter @workspace/db run push`.

## Common workflows

```bash
# Update API contract (after editing lib/api-spec/openapi.yaml)
pnpm --filter @workspace/api-spec run codegen

# Push DB schema changes
pnpm --filter @workspace/db run push

# Seed demo data (idempotent — safe to re-run)
pnpm --filter @workspace/scripts run seed

# Run typechecks
pnpm -w run typecheck
```

## Environment variables

Auto-managed: `DATABASE_URL`, `DEFAULT_OBJECT_STORAGE_BUCKET_ID`, `PUBLIC_OBJECT_SEARCH_PATHS`, `PRIVATE_OBJECT_DIR`, `SESSION_SECRET`.

Custom: `ADMIN_USERNAME`, `ADMIN_PASSWORD` (defaults to `admin` / `tandava2024`).

Frontend-only (Vite, exposed to browser): `VITE_API_URL` — set when the API
and frontend are deployed to **different** origins (the typical Vercel
split-project setup). When unset, the React app uses relative `/api/...`
URLs, which is correct for local dev (Vite proxy) and same-origin deploys.

## GitHub + Vercel deployment

The repo is set up for two-project Vercel deployment:

- `artifacts/api-server/vercel.json` — Express app re-exported as a serverless
  function at `api/[...all].ts`; rewrites all `/api/*` traffic to it.
- `artifacts/tandava/vercel.json` — Vite frontend with SPA-fallback rewrite
  so wouter routes survive hard reloads.

Full step-by-step (root directories, build commands, required env vars,
custom domain wiring, security checklist) lives in **`DEPLOYMENT.md`**.

## Brand assets

The hand-drawn Tandava logo lives at `artifacts/tandava/public/tandava-logo.jpg`. Generated atmospheric Kerala imagery lives in `artifacts/tandava/public/generated/`.

## Company contact details

- Phones: +91 7012393250 / +91 9526041005
- Email: tandavatours@gmail.com
- Instagram: [@tandava_tour_company](https://www.instagram.com/tandava_tour_company/)
- Location: Thiruvananthapuram, Kerala
