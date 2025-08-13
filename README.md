# Convex Randomizer

Next.js + Convex app with a minimal CRM (`/products`) and a randomizer (`/randomizer`). Supports JSON import/export, inline JSON preview, and optional recent-pick stats.

### Environment
- `NEXT_PUBLIC_CONVEX_URL`: Your Convex deployment URL (browser-visible)
- `ADMIN_PASSWORD` (optional): Enables basic auth for `/products` in production
- `RANDOMIZER_STATS` (optional, default 0): Set to `1` to collect recent picks

See `.env.example` for values. Create `.env.local` in the project root.

### Project Structure
```
convex/
  schema.ts, products.ts, randomizer.ts, _generated/
app/
  products/, randomizer/, api/health
lib/convexClient.ts
middleware.ts
render.yaml
```

## Local Development
1) Install deps
```bash
npm ci
```
2) Set env
```bash
cp .env.example .env.local
# Edit NEXT_PUBLIC_CONVEX_URL to your Convex deployment URL
```
3) Start Convex and push schema (one-time after changes)
```bash
npx convex dev &
npx convex push
```
4) Run the app
```bash
npm run dev
```
5) Typecheck and production build
```bash
npm run typecheck
npm run build
```

## Render Deployment
This repo includes `render.yaml` for zero-config deploy.

Steps:
1) Create a Convex deployment and copy its Deployment URL
2) Create a new Web Service on Render from this repo (Blueprints supported)
3) Set environment variables:
   - `NEXT_PUBLIC_CONVEX_URL` = your Convex Deployment URL
   - `ADMIN_PASSWORD` (optional)
   - `RANDOMIZER_STATS=1` (optional)
4) Render uses:
   - Build: `npm ci && npm run build`
   - Start: `npm run start`

## Notes
- All imports are relative and resolved via Next.js app router
- Convex types are generated into `convex/_generated/*` via `npx convex codegen`
- Health check: `GET /api/health` returns `{ ok: true }`
