# Deploying the Business Formation Coach

This follows the same Docker Compose approach as the Investment Property Analyzer, joining your existing `automation-stack` infrastructure (Nginx Proxy Manager + Postgres) without modifying it.

The app is already live on the VPS at `coach.myfinancial.help` from the Phase 1 (no-accounts) deploy. This document now also covers the accounts upgrade, which adds a Postgres database — treat the steps below as an update to that existing deployment, not a fresh install.

## What this needs from your VPS

- Docker + Docker Compose (already set up)
- `automation-stack_automation_network` (for Nginx Proxy Manager to reach the app) and `automation-stack_database_network` (for the app to reach the existing `postgres` container) — both already exist since `automation-stack` created them
- A dedicated Postgres role and database for this app (steps below — same pattern used for the Investment Property Analyzer, do not reuse its role/database)

## Updating the existing deployment for accounts

1. **Pull the latest code**:
   ```bash
   cd /root/business-coach
   git pull origin main
   ```

2. **Create a Postgres role and database for this app.** From the VPS, exec into the existing `postgres` container (same one the Investment Property Analyzer uses — this creates a separate role/database inside it, not a new Postgres instance):
   ```bash
   docker exec -it postgres psql -U postgres
   ```
   Then, at the `psql` prompt, pick your own password in place of the placeholder (don't reuse the Investment Property Analyzer's password — separate app, separate credential):
   ```sql
   CREATE ROLE business_coach WITH LOGIN PASSWORD 'pick-a-real-password-here';
   CREATE DATABASE business_coach OWNER business_coach;
   \q
   ```

3. **Update `.env`** with the real values. Open it:
   ```bash
   nano .env
   ```
   Set:
   - `DATABASE_URL="postgresql://business_coach:pick-a-real-password-here@postgres:5432/business_coach"` (use the exact password you set in step 2 — note the host is `postgres`, the container name, not `localhost`)
   - `NEXTAUTH_SECRET` — generate one with `openssl rand -base64 32` and paste the output in
   - `NEXTAUTH_URL="https://coach.myfinancial.help"`

   As before, if your password contains an `@` or other URL-special character, that breaks `postgresql://user:pass@host` parsing — either avoid those characters when picking the password in step 2, or percent-encode them in the connection string.

4. **Rebuild and restart**:
   ```bash
   docker compose up -d --build
   ```
   This runs `prisma migrate deploy` automatically on startup (via `docker-entrypoint.sh`), creating the `User`, `StageProgress`, and `BusinessProfile` tables.

5. **Verify**:
   ```bash
   docker compose logs -f app
   ```
   You should see `Applying database migrations...` followed by Next.js reporting `Ready`. Then confirm the app can actually reach Postgres by creating an account through the UI at `https://coach.myfinancial.help/signup` — if that succeeds, the DB connection is good.

## Adding the AI business plan feature (ANTHROPIC_API_KEY)

The `/business-plan` page (generates a downloadable/printable business plan once someone finishes all 11 stages and fills in the questionnaire) needs an Anthropic API key. Everything else in the app works fine without it — generation just returns a clear error until it's set.

1. Get a key at [console.anthropic.com](https://console.anthropic.com) if you don't already have one.
2. Add it directly to `.env` on the VPS — same rule as the database password: **never paste a real API key into this chat.** Run this on the VPS, entering the key only in your terminal:
   ```bash
   cd /root/business-coach
   nano .env
   ```
   Add or edit the line:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
   Save and exit.
3. Rebuild:
   ```bash
   docker compose up -d --build
   ```
4. Verify without exposing the key:
   ```bash
   grep -c '^ANTHROPIC_API_KEY=sk-ant-' .env
   ```
   Should print `1`.

## Adding admin access (ADMIN_EMAILS)

`/admin` lets an admin update affiliate links without redeploying and manage (delete) accounts. Access is granted by email — no separate admin signup flow, no secret involved, safe to set directly:

1. **Sign up for a normal account first** at `https://coach.myfinancial.help/signup` with the email you want to be the admin, if you haven't already.
2. On the VPS:
   ```bash
   cd /root/business-coach
   nano .env
   ```
   Add or edit:
   ```
   ADMIN_EMAILS=you@example.com
   ```
   Comma-separate multiple admins: `ADMIN_EMAILS=you@example.com,someone-else@example.com`.
3. Rebuild:
   ```bash
   docker compose up -d --build
   ```
4. Log in with that account — an "Admin" link appears in the sidebar.

## Fresh install (if you haven't deployed this app before)

Follow steps 1-5 above in order, but clone the repo first:
```bash
git clone https://github.com/OneWithDigital/Business-Coach.git /root/business-coach
cd /root/business-coach
cp .env.example .env
```
Then continue from step 2. After the container is running, set up the Nginx Proxy Manager proxy host (Forward Hostname/IP: `business-coach`, Forward Port: `3000`) and request SSL the same way as the Investment Property Analyzer.

## What was actually tested before this was handed to you

- `npm install`, `npm run test`, and `npm run build` all ran successfully, most recently with the `AffiliateOverride` model and the admin routes/page added.
- Every Prisma schema change, including this one, was verified against a **real local Postgres server** (not just written by hand): a temporary role/database were created, `prisma migrate dev` generated the migration from the actual schema, and a smoke test created real rows (most recently an `AffiliateOverride` row) and read them back successfully. The temporary role/database were dropped afterward — nothing from that test exists on your VPS.
- The actual Claude API call in `/api/business-plan/generate` was **not** exercised end-to-end in this sandbox (no API key available here) — the prompt-building and response-parsing logic around it is unit-tested, but the live call itself should be smoke-tested once `ANTHROPIC_API_KEY` is set on the VPS.
- The Docker build itself was **not** run end-to-end in this sandbox (no Docker daemon available here) — same limitation noted for the Phase 1 deploy and the Investment Property Analyzer. Watch `docker compose up -d --build` output closely the first time.
