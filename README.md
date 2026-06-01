# BikeMasters WMS

A multi-tenant **Workshop Management System** for bike shops, supporting job card workflows, inventory, invoicing, insurance, CRM, and reporting — across multiple organizations and garage branches.

---

## Architecture

```mermaid
graph TD
    subgraph Client
        WEB["Next.js 14 Frontend\n(localhost:3000)\nApp Router · Tailwind CSS"]
    end

    subgraph Server
        API["NestJS REST API\n(localhost:4000)\nSwagger at /api-docs"]
    end

    subgraph Data
        PG[("PostgreSQL 15\nlocalhost:5432\nRLS · Multi-tenant")]
        RD[("Redis 7\nlocalhost:6379\nSession · Cache")]
    end

    subgraph Packages
        ST["packages/shared-types\nShared TypeScript interfaces"]
    end

    WEB -- "HTTP / REST (CORS)" --> API
    API --> PG
    API --> RD
    WEB -. "TypeScript types" .-> ST
    API -. "TypeScript types" .-> ST
```

### Monorepo Layout

```
bikemaster/
├── apps/
│   ├── api/          # NestJS backend (port 4000)
│   └── web/          # Next.js frontend (port 3000)
├── packages/
│   └── shared-types/ # Shared TypeScript interfaces
├── db/
│   ├── schema/       # DDL create + rollback scripts
│   ├── dml/          # Seed data
│   └── dcl/          # RLS permission policies
├── docs/specs/       # Feature specification documents (spec-01 to spec-15)
├── docker-compose.yml
├── turbo.json
└── package.json
```

---

## 🛠 Complete Local Setup

Follow these steps to get the system running on your local machine.

### 1. Clone & Install
```bash
git clone https://github.com/adityalaitik/bikemaster.git
cd bikemaster
npm install
```

### 2. Infrastructure (PostgreSQL & Redis)
You can run these via Docker or use a managed service like Railway.
```bash
# Start local PG and Redis
docker-compose up -d
```

### 3. Database Initialization
Execute the SQL scripts in this specific order to create the schema, seed data, and apply permissions:
```bash
# Replace host, user and db name if using a remote service
psql -h localhost -U postgres -d bikemaster -f db/schema/ddl_create.sql
psql -h localhost -U postgres -d bikemaster -f db/dml/seed_data.sql
psql -h localhost -U postgres -d bikemaster -f db/dcl/permissions.sql
```

### 4. Environment Variables
Create the following `.env` files:

**`apps/api/.env`**
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bikemaster
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_long_random_secret_here
PORT=4000
CORS_ORIGIN=http://localhost:3000
```

**`apps/web/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 5. Run the Application
```bash
# Starts both Frontend and Backend
npm run dev
```

| Service | Access URL |
|---|---|
| **Frontend** | http://localhost:3000 |
| **Backend API** | http://localhost:4000 |
| **API Docs** | http://localhost:4000/api-docs |

### 6. Demo Login Credentials
Use these accounts to explore the multi-tenant workflows:
- **Super Admin**: `admin@bikemasters.in` / `admin123`
- **Garage Manager**: `manager.bbr@bikemasters.in` / `manager123`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend | NestJS 10, TypeScript, Express |
| Database | PostgreSQL 15 (UUID keys, RLS multi-tenancy) |
| Cache / Sessions | Redis 7 |
| Monorepo | Turborepo 2, npm workspaces |
| API Docs | Swagger UI (`/api-docs`) |

---

## Prerequisites

- Node.js ≥ 20
- npm ≥ 10
- Docker & Docker Compose (for PostgreSQL and Redis)

---

## Key Commands

```bash
npm run dev        # Run all apps in watch mode
npm run build      # Build all apps
npm run lint       # Lint all apps
npm run clean      # Remove all build outputs
```

To run a single workspace:
```bash
npm run dev --workspace=apps/api
npm run dev --workspace=apps/web
```

## E2E Testing (Playwright)

End-to-end tests live in the `e2e/` directory and cover the complete job lifecycle: new customer registration → estimation → status workflow → discount → payment → delivery.

### Prerequisites

Make sure both servers are running before executing tests:
```bash
npm run dev   # starts Next.js (port 3000) and NestJS (port 4000)
```

### Setup

```bash
cd e2e
npm install
```

> Tests use **system Chrome** (no browser download required). Make sure Google Chrome is installed.

### Run Tests

```bash
# Run all tests (headed Chrome — you can watch the browser)
npm run test:headed

# Run only the full lifecycle smoke test
npx playwright test --headed -g "Full lifecycle smoke test"

# Slow demo — 3-second pause between every step so you can verify each action
npx playwright test --headed -g "Full lifecycle — slow demo"

# Open Playwright UI (interactive test explorer)
npm run test:ui

# Run headless (CI mode)
npm test

# View HTML report after a run
npm run report
```

### Test Coverage

| Test | Description |
|---|---|
| Step 1 | Register new customer and vehicle |
| Step 2 | Open job card and navigate to estimation |
| Step 3 | Add spares and services in estimation |
| Step 4 | Change status → Client Agreed |
| Step 5 | Change status → Work in Progress |
| Step 6 | Apply a 10% discount |
| Step 7 | Record advance payment |
| Step 8 | Progress through Work Completed → Out for Delivery → Delivered |
| Step 9 | Verify timeline reflects full status history |
| Step 10 | Generate invoice |
| Smoke | Full lifecycle end-to-end in a single test |
| Slow demo | Same as smoke but with 3-second pauses for manual verification |

---

## Vercel Deployment

This repository includes `vercel.json` for deploying the frontend from the monorepo root. Deploy the NestJS API separately on a Node host such as Railway, Render, Fly.io, or Azure App Service.

In Vercel, keep the project root as the repository root and set:

```env
NEXT_PUBLIC_API_URL=https://your-api-host.example.com
```

The Vercel build runs `npm run build --workspace=apps/web` and outputs `apps/web/.next`.

### API Deployment

For Railway or a similar Node host, use:

```bash
npm install
npm run build --workspace=apps/api
npm run start:prod --workspace=apps/api
```

Set API environment variables from `apps/api/.env.example`:

```env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=replace-with-a-long-random-secret
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

After PostgreSQL is available, initialize it in this order:

```bash
psql "$DATABASE_URL" -f db/schema/ddl_create.sql
psql "$DATABASE_URL" -f db/dml/seed_data.sql
psql "$DATABASE_URL" -f db/dcl/permissions.sql
```

---

## Database

PostgreSQL 15 with 40+ tables in a 19-tier schema. Multi-tenancy is enforced via Row-Level Security (RLS) — every request must set `app.current_garage_id` in the session context.

**Core domains:** Organizations → Garages → Users → Job Cards → Estimation (Spare Items + Services) → Invoices → Payments

To reset the database:
```bash
psql -h localhost -U postgres -d bikemaster -f db/schema/ddl_rollback.sql
psql -h localhost -U postgres -d bikemaster -f db/schema/ddl_create.sql
```

---

## Project Roles

The system has 7 user roles: `super_admin`, `org_admin`, `garage_manager`, `service_advisor`, `technician`, `cashier`, `viewer`.

---

## Feature Specs

Detailed specifications for each module are in `docs/specs/`:

| File | Module |
|---|---|
| spec-01 | Project Setup & Monorepo |
| spec-02 | Database Schema |
| spec-03 | Auth & Authorization |
| spec-04 | Customer & Vehicle Registration |
| spec-05 | Service Queue (Job Cards) |
| spec-06 | Estimation Page |
| spec-07 | Inventory Management |
| spec-08 | Invoicing & Payments |
| spec-09 | Insurance Module |
| spec-10 | CRM & Follow-ups |
| spec-11 | Reports |
| spec-12 | BI Dashboard |
| spec-13 | Settings & Configuration |
| spec-14 | Super Admin |
| spec-15 | Azure Deployment |
