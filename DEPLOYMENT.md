# Deploying Tandava Tour Company to Vercel

This repo is a pnpm monorepo with two deployable artifacts:

- `artifacts/api-server` — Express 5 API (PostgreSQL + Drizzle, sessions, uploads).
- `artifacts/tandava` — React + Vite frontend (public site + admin panel).

The recommended setup on Vercel is **two projects from the same GitHub repo**, one
per artifact. They communicate over HTTPS and share session cookies via CORS.

---

## 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:<your-user>/<your-repo>.git
git push -u origin main
```

`.gitignore` already excludes `.env`, `.env.*`, `node_modules`, `dist`, `build`,
`.vercel`, `logs`, `uploads`, and `*.log`. Confirm with `git status` before pushing.

---

## 2. Create a Postgres database

Pick any managed Postgres (Neon, Supabase, RDS, Railway, etc.). Capture the
connection string — you will paste it into both Vercel projects as
`DATABASE_URL`.

After the DB is created, run the schema push and (optionally) seed it from your
local machine **once**:

```bash
DATABASE_URL='postgres://...' pnpm --filter @workspace/db run push
DATABASE_URL='postgres://...' pnpm --filter @workspace/scripts run seed
```

---

## 3. Deploy the API project

| Setting              | Value                                                 |
| -------------------- | ----------------------------------------------------- |
| Framework Preset     | Other                                                 |
| Root Directory       | `artifacts/api-server`                                |
| Build Command        | (leave blank — uses serverless function)              |
| Output Directory     | (leave blank)                                         |
| Install Command      | `cd ../.. && pnpm install --frozen-lockfile`          |
| Node.js Version      | 20.x or 22.x                                          |

The included `artifacts/api-server/vercel.json` configures the
`api/[...all].ts` serverless function (max duration 30s) and rewrites every
`/api/*` request to it. The Express app is re-exported as the function's
default handler, so all existing routes work unchanged.

### Required environment variables (API project)

| Variable                | Required        | Notes                                                                                  |
| ----------------------- | --------------- | -------------------------------------------------------------------------------------- |
| `NODE_ENV`              | yes             | `production`                                                                           |
| `DATABASE_URL`          | yes             | Postgres connection string (must allow SSL).                                           |
| `SESSION_SECRET`        | yes             | At least 32 bytes. `openssl rand -hex 32`.                                             |
| `ADMIN_USERNAME`        | yes             | e.g. `admin`.                                                                          |
| `ADMIN_PASSWORD_HASH`   | yes (preferred) | bcrypt hash, cost ≥ 12. Generate with `node -e "console.log(require('bcryptjs').hashSync('your-password', 12))"`. |
| `ADMIN_PASSWORD`        | fallback        | Plain password (≥ 8 chars). Hashed on boot. Use only if you cannot pre-compute a hash. |
| `ALLOWED_ORIGINS`       | yes             | Comma-separated list of frontend origins, e.g. `https://tandavatours.vercel.app,https://www.tandavatours.com`. |

Object-storage variables (`PUBLIC_OBJECT_SEARCH_PATHS`, `PRIVATE_OBJECT_DIR`)
are only needed when uploads are enabled and a storage backend is wired in.

### Verifying the API deploy

```
GET https://<api-project>.vercel.app/api/health
→ {"status":"ok"}
```

---

## 4. Deploy the frontend project

| Setting              | Value                                          |
| -------------------- | ---------------------------------------------- |
| Framework Preset     | Vite                                           |
| Root Directory       | `artifacts/tandava`                            |
| Build Command        | `pnpm build`                                   |
| Output Directory     | `dist/public`                                  |
| Install Command      | `cd ../.. && pnpm install --frozen-lockfile`   |
| Node.js Version      | 20.x or 22.x                                   |

The included `artifacts/tandava/vercel.json` rewrites all unmatched paths to
`/index.html` so client-side (wouter) routing works on hard reloads.

### Required environment variables (frontend project)

| Variable        | Required | Notes                                                                                |
| --------------- | -------- | ------------------------------------------------------------------------------------ |
| `VITE_API_URL`  | yes      | Full origin of the API project, e.g. `https://tandava-api.vercel.app`. No trailing slash. Exposed to the browser. |

Vite inlines `VITE_*` variables at build time, so a fresh build is required
after changing them.

---

## 5. Custom domains

1. Add the production domain to the **frontend** project (e.g. `tandavatours.com`).
2. Add the API subdomain to the **API** project (e.g. `api.tandavatours.com`).
3. Update the API project's `ALLOWED_ORIGINS` to include the frontend's final
   domain(s): `https://tandavatours.com,https://www.tandavatours.com`.
4. Update the frontend project's `VITE_API_URL` to `https://api.tandavatours.com`
   and redeploy the frontend.

Cookies are issued from the API origin with `SameSite=Lax; Secure; HttpOnly`,
so admin login works as long as `ALLOWED_ORIGINS` matches the frontend domain
exactly and the browser sees both origins over HTTPS.

---

## 6. Local verification before pushing

```bash
pnpm install
pnpm run typecheck   # must be clean
pnpm run build       # builds api-server, tandava, mockup-sandbox
```

Restart the Replit workflows (`API Server`, `Start application`) after pulling
new changes to pick them up.

---

## 7. Security checklist

- [x] `helmet` configured on every API request (HSTS in prod, X-Frame-Options DENY, etc.).
- [x] `cors` restricted to `ALLOWED_ORIGINS` with `credentials: true`.
- [x] Sessions are `httpOnly`, `secure` in prod, `sameSite: lax`, custom cookie name `tandava.sid`.
- [x] `SESSION_SECRET` and `ADMIN_PASSWORD(_HASH)` refuse to start in production unless set.
- [x] Bcrypt admin password (cost 12) + per-IP login lockout (3 fails / 5 min → 5 min lock).
- [x] Rate limits on general API, admin login, write ops, and uploads.
- [x] Upload validation: image MIME only, 10 MB cap, executable extensions blocked, filenames sanitized.
- [x] Object-serving routes block `..` and absolute paths.
- [x] No secrets in source — `.gitignore` covers `.env`, `.env.*`, `*.pem`, `*.key`.
- [x] Production never returns stack traces (centralised error handler).
