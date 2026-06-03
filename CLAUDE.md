# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BikeMasters WMS (Workshop Management System) — a multi-tenant bike shop management platform for managing workshop operations across multiple organizations and garage branches. Supports vehicle service workflows, inventory, invoicing, insurance, CRM, and reporting.

## Monorepo Structure

Turborepo monorepo with npm workspaces:

- `apps/api/` — NestJS REST API (port 4000, Swagger at `/api-docs`)
- `apps/web/` — Next.js 14 frontend (port 3000, App Router)
- `packages/shared-types/` — TypeScript type definitions shared between apps
- `db/` — MySQL schema, seed data, and management scripts

## Commands

### Root (runs all apps via Turborepo)
```bash
npm install          # Install all workspace dependencies
npm run dev          # Run all apps in watch mode
npm run build        # Build all apps
npm run lint         # Lint all apps
npm run clean        # Clean all dist/.next outputs
```

### Database
```bash
npm run db:setup     # First-time setup: create DB + user + schema + seeds
npm run db:dump      # After a schema change: capture live DB → update db/ files
npm run db:apply     # After pulling someone else's schema change: sync your local DB
npm run db:reset     # DESTRUCTIVE: drop everything and rebuild from db/ files
```

### Individual apps
```bash
# API (apps/api/)
npm run dev          # NestJS watch mode
npm run build        # Compile to dist/
npm run start:prod   # Run compiled output

# Web (apps/web/)
npm run dev          # Next.js dev server
npm run build        # Production build
npm run lint         # ESLint

# Shared types (packages/shared-types/)
npm run build        # Compile TypeScript
npm run dev          # Watch mode
```

To run commands for a specific app from the root: `npm run dev --workspace=apps/api`

## Architecture

### Data Flow
```
Next.js (localhost:3000)
    ↓ HTTP/REST (CORS configured)
NestJS API (localhost:4000)
    ↓
MySQL 8.x (localhost:3306, database: bikemaster)
```

### API (`apps/api/`)
Single-module NestJS app — all logic currently lives in `app.controller.ts` (endpoints) and `app.service.ts` (business logic). Swagger docs auto-generated. Uses TypeORM with `synchronize: false` — all schema changes must go through `db/scripts/dump.sh`.

### Web (`apps/web/`)
Next.js App Router with two main routes:
- `/` — Dashboard with job card queue, search, and statistics (`src/app/page.tsx`)
- `/estimation/[jobCardId]` — Dynamic estimation and invoice page

Client components fetch from the API directly. Tailwind CSS for styling.

### Shared Types (`packages/shared-types/`)
Central TypeScript interfaces used by both apps. When adding new API contracts, define types here first. Key exports: `UserRole` (7 roles), `User`, `Organization`, `Garage`, `UserGarageAssignment`, and job card/service/spare item types.

## Database

MySQL 8.x with 48 tables. Connection: `admin:LeOmm@8769@localhost:3306/bikemaster`.

Key design patterns:
- UUID primary keys everywhere
- `DECIMAL(12,2)` for all financial values
- `JSON` columns for flexible fields (inspection checklists, status history, audit logs)
- TypeORM entities in `apps/api/src/entities/` — `synchronize: false`, so schema is managed manually

### db/ folder layout
```
db/
  schema/schema.sql     ← AUTO-GENERATED full DDL (source of truth — never edit by hand)
  seeds/seed_data.sql   ← AUTO-GENERATED reference data (brands, services, parts, users…)
  scripts/
    setup.sh            ← first-time: create DB + user + schema + seeds
    dump.sh             ← capture live DB → update schema.sql + seed_data.sql
    apply.sh            ← apply schema.sql + seeds to existing DB (safe, no data loss)
    reset.sh            ← DESTRUCTIVE: drop everything and rebuild from scratch
```

### Schema change workflow
1. Make the change in MySQL (via TypeORM entity or direct SQL)
2. `npm run db:dump` — updates `schema.sql` and `seed_data.sql`
3. Commit both files so other devs can sync with `npm run db:apply`

### First-time setup (after cloning)
```bash
npm run db:setup   # creates DB, user, applies schema + seeds in one step
```

### Key table groups
| Domain | Tables |
|--------|--------|
| Multi-tenancy | `organizations`, `garages` |
| Users & Access | `users`, `user_garage_assignments`, `employees`, `designations` |
| Vehicles & Customers | `customers`, `vehicles`, `customer_vehicles`, `vehicle_brands/models/variants` |
| Service Workflow | `job_cards`, `job_card_technicians`, `job_complaints`, `vehicle_inspections` |
| Estimation | `job_spare_items`, `job_service_items` |
| Inventory | `spare_parts`, `inventory_batches`, `inventory_transactions`, `vendors` |
| Financial | `invoices`, `payments`, `discounts`, `tax_rates` |
| Insurance | `vehicle_insurance`, `insurance_claims` |

## Specs

`docs/specs/` contains 15 detailed specification files (spec-01 through spec-15) covering each module. Consult these before implementing any new feature — they define the intended behavior, data models, and UI flows.
