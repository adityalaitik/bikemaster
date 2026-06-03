# BikeMasters WMS Project Instructions

This document provides essential information and guidelines for working on the BikeMasters Workshop Management System (WMS) project.

## Project Overview

BikeMasters WMS is a multi-tenant Workshop Management System designed for bike shops. It supports job card workflows, inventory management, invoicing, payments, insurance claims, CRM, and comprehensive reporting across multiple organizations and garage branches.

### Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend:** NestJS 10, TypeScript, Express, Swagger.
- **Database:** PostgreSQL 15 (with Row-Level Security for multi-tenancy), Redis 7 (Cache/Sessions).
- **Monorepo Management:** Turborepo 2, npm workspaces.

### Architecture

The project follows a monorepo structure:
- `apps/api`: NestJS backend application (runs on port 4000 by default).
- `apps/web`: Next.js frontend application (runs on port 3000 by default).
- `packages/shared-types`: Shared TypeScript interfaces used by both frontend and backend.
- `db/`: Database scripts (DDL, DML, DCL).
- `docs/specs/`: Feature specification documents.

## Local Development Setup

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10
- Docker & Docker Compose (for local PostgreSQL and Redis)

### Initial Setup

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Start infrastructure (Redis only):**
    Ensure your local MySQL service is running. You can still use Docker for Redis:
    ```bash
    docker-compose up -d redis
    ```
3.  **Initialize the database (Local MySQL):**
    Ensure you have created the `bikemaster` database and user in your local MySQL. Use the provided credentials in `apps/api/src/app.module.ts`.
    Execute the SQL scripts using your local MySQL client:
    ```bash
    mysql -u admin -p bikemaster < db/schema/ddl_create.sql
    mysql -u admin -p bikemaster < db/dml/seed_data.sql
    ```
4.  **Configure environment variables:**
    - `apps/api/.env`: Set `DATABASE_URL` to your local MySQL connection string.
    - `apps/web/.env.local`: Set `NEXT_PUBLIC_API_URL=http://localhost:4000`.

**Note:** This project is configured to use a local MySQL installation by default. Do not use the `mysql` service in `docker-compose.yml` unless specifically requested.

### Running the Project

- **Full Stack:** `npm run dev`
- **Frontend only:** `npm run dev --workspace=apps/web`
- **Backend only:** `npm run dev --workspace=apps/api`

## Development Conventions

### Multi-Tenancy

- Multi-tenancy is strictly enforced at the database level using **PostgreSQL Row-Level Security (RLS)**.
- Every request to the database must set the `app.current_garage_id` in the session context.
- Ensure all new tables include appropriate RLS policies in `db/dcl/permissions.sql`.

### Authentication & Authorization

- **JWT-based authentication** is used for the API.
- **Roles:** The system supports multiple roles: `super_admin`, `org_admin`, `garage_manager`, `service_advisor`, `technician`, `cashier`, `viewer`.
- Authorization is handled via decorators and guards in NestJS (e.g., `@Roles()`, `RolesGuard`).

### API Documentation

- Swagger UI is available at `http://localhost:4000/api-docs` when the backend is running.
- Always update Swagger documentation for new endpoints.

### Coding Style

- **TypeScript:** Use strict typing. Prefer shared types from `packages/shared-types`.
- **Frontend:** Use Tailwind CSS for styling and Lucide icons for iconography.
- **Backend:** Follow NestJS modular structure. Keep business logic in services.

### Database Migrations

- Currently, database changes are managed via manual SQL scripts in `db/schema/`.
- `ddl_create.sql`: Contains the full schema creation.
- `ddl_rollback.sql`: Reverts the schema changes.
- Always update these scripts when modifying the database structure.

## Deployment

- **Frontend:** Optimized for Vercel deployment.
- **Backend:** Can be deployed to any Node.js host (e.g., Railway, Azure App Service).
- **Database:** Requires PostgreSQL 15+ with RLS support.

## Feature Specifications

Refer to `docs/specs/` for detailed requirements of each module (e.g., Job Cards, Inventory, Invoicing).
