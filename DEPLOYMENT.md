# Deploying the Business Formation Coach

This follows the same Docker Compose approach as the Investment Property Analyzer, joining your existing `automation-stack` infrastructure (Nginx Proxy Manager) without modifying it. Phase 1 has no database, so this is simpler — no Postgres, no Prisma, no migrations.

## What this needs from your VPS

- Docker + Docker Compose (already set up, since `automation-stack` runs on it)
- The `automation-stack_automation_network` Docker network to already exist (it does — that's the network `nginx-proxy-manager` is on)
- Nothing else. No database, no SMTP, no external API keys are required for the app to run — the only optional config is affiliate links (see below).

## Steps

1. **Clone this repo to the VPS**, e.g. into `/root/business-coach`:
   ```bash
   git clone git@github.com:OneWithDigital/Business-Coach.git /root/business-coach
   cd /root/business-coach
   ```

2. **Create your `.env` file** from the example:
   ```bash
   cp .env.example .env
   ```
   Every variable in `.env.example` is an `AFFILIATE_URL_*` var and is optional. Leave any of them blank and that option just shows "Link coming soon" in the UI instead of a broken/fake link — you can fill these in later as you sign up for each affiliate program. See `lib/affiliateLinks.ts` for what each one is.

3. **Build and start the container**:
   ```bash
   docker compose up -d --build
   ```

4. **Verify it's running**:
   ```bash
   docker compose logs -f app
   ```
   You should see Next.js report `Ready` with no errors. Then confirm it's reachable inside the Docker network:
   ```bash
   docker exec business-coach wget -qO- http://localhost:3000/ | head -5
   ```

5. **Point Nginx Proxy Manager at it**, same pattern as the Investment Property Analyzer:
   - In the NPM UI, add a new Proxy Host.
   - Domain: whatever subdomain you want (e.g. `coach.yourdomain.com`).
   - Forward Hostname/IP: `business-coach` (the container name — NPM can resolve it directly since both containers share `automation-stack_automation_network`).
   - Forward Port: `3000`.
   - Enable SSL via NPM's built-in Let's Encrypt request once DNS for that subdomain points at your VPS's IP.

6. **DNS**: add an A record for whatever subdomain you chose, pointing at your VPS's public IP. Propagation can take a few minutes to a few hours depending on your DNS provider/TTL.

## Updating affiliate links later

Edit `.env` on the VPS, add the real URL for whichever `AFFILIATE_URL_*` var, then:
```bash
docker compose up -d --build
```
(Restart is enough if you didn't change code — `docker compose restart app` — but a rebuild is always safe.)

## What was actually tested before this was handed to you

- `npm install`, `npm run test` (22 unit tests covering the entity/bank/credit-card decision logic and the break-even calculator), and `npm run build` were all run successfully in the sandbox this was built in — all 11 stage pages statically prerender.
- The Docker build itself was **not** run end-to-end against a live registry in this sandbox environment (network restrictions here block that kind of test, same limitation noted in the Investment Property Analyzer's deployment notes). The Dockerfile follows the same pattern already proven working for that app's deployment, minus the Postgres/Prisma-specific steps this app doesn't need — but do watch `docker compose up -d --build` output on the actual VPS the first time, the same as you did for the other app.
