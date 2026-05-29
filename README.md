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

## Getting Started

```bash
# 1. Install all workspace dependencies
npm install

# 2. Start infrastructure
docker-compose up -d

# 3. Seed the database
psql -h localhost -U postgres -d bikemaster -f db/schema/ddl_create.sql
psql -h localhost -U postgres -d bikemaster -f db/dml/seed_data.sql
psql -h localhost -U postgres -d bikemaster -f db/dcl/permissions.sql

# 4. Configure environment variables (see below)

# 5. Start all apps in development mode
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API | http://localhost:4000 |
| API Docs (Swagger) | http://localhost:4000/api-docs |

---

## Environment Variables

Create `.env` files in each app directory. Minimum required:

**`apps/api/.env`**
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/bikemaster
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
PORT=4000
```

**`apps/web/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

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
