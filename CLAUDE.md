# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BikeMasters WMS (Workshop Management System) — a multi-tenant bike shop management platform for managing workshop operations across multiple organizations and garage branches. Supports vehicle service workflows, inventory, invoicing, insurance, CRM, and reporting.

## Monorepo Structure

Turborepo monorepo with npm workspaces:

- `apps/api/` — NestJS REST API (port 4000, Swagger at `/api-docs`)
- `apps/web/` — Next.js 14 frontend (port 3000, App Router)
- `packages/shared-types/` — TypeScript type definitions shared between apps
- `db/` — PostgreSQL DDL, seed data, RLS policies

## Commands

### Root (runs all apps via Turborepo)
```bash
npm install          # Install all workspace dependencies
npm run dev          # Run all apps in watch mode
npm run build        # Build all apps
npm run lint         # Lint all apps
npm run clean        # Clean all dist/.next outputs
```

### Infrastructure
```bash
docker-compose up -d         # Start PostgreSQL (5432) and Redis (6379)
docker-compose down          # Stop services
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
PostgreSQL (localhost:5432) + Redis (localhost:6379)
```

### API (`apps/api/`)
Single-module NestJS app — all logic currently lives in `app.controller.ts` (endpoints) and `app.service.ts` (business logic). Swagger docs auto-generated. No ORM yet; direct SQL queries expected.

### Web (`apps/web/`)
Next.js App Router with two main routes:
- `/` — Dashboard with job card queue, search, and statistics (`src/app/page.tsx`)
- `/estimation/[jobCardId]` — Dynamic estimation and invoice page

Client components fetch from the API directly. Tailwind CSS for styling.

### Shared Types (`packages/shared-types/`)
Central TypeScript interfaces used by both apps. When adding new API contracts, define types here first. Key exports: `UserRole` (7 roles), `User`, `Organization`, `Garage`, `UserGarageAssignment`, and job card/service/spare item types.

## Database

PostgreSQL 15 with 40+ tables across a 19-tier schema. Key design patterns:
- UUID primary keys everywhere (`uuid-ossp` extension)
- Row-Level Security (RLS) for multi-tenancy — tenant isolation via `app.current_garage_id` session variable
- `DECIMAL(12,2)` for all financial values
- `JSONB` for flexible fields (inspection checklists, audit log old/new values, template variables)

Schema files:
- `db/schema/ddl_create.sql` — Full DDL
- `db/dml/seed_data.sql` — Sample data (org, garages, users, vehicle brands, tax rates)
- `db/dcl/permissions.sql` — RLS policies
- `db/schema/ddl_rollback.sql` — Rollback script

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
