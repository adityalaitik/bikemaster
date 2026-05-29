# Repository Guidelines

## Project Structure & Module Organization

BikeMasters WMS is an npm workspace monorepo managed by Turborepo. Application code lives in `apps/`: `apps/web` is the Next.js frontend on port 3000, and `apps/api` is the NestJS backend on port 4000. Shared TypeScript interfaces are in `packages/shared-types/src`. Database assets are under `db/schema`, `db/dml`, and `db/dcl`; feature specifications are in `docs/specs`. Generated output such as `dist`, `.next`, `.turbo`, and `node_modules` should not be edited directly.

## Build, Test, and Development Commands

Run commands from the repository root unless targeting one workspace.

```bash
npm install                    # Install all workspace dependencies
docker-compose up -d           # Start PostgreSQL and Redis
npm run dev                    # Run all apps in watch mode via Turbo
npm run build                  # Build all workspaces
npm run lint                   # Lint configured workspaces
npm run clean                  # Remove build outputs
npm run dev --workspace=apps/api
npm run dev --workspace=apps/web
```

Seed local data with the SQL scripts listed in `README.md`, in this order: `db/schema/ddl_create.sql`, `db/dml/seed_data.sql`, then `db/dcl/permissions.sql`.

## Coding Style & Naming Conventions

Use TypeScript throughout. Follow existing framework conventions: Next.js App Router files under `apps/web/src/app`, NestJS modules/controllers/services under `apps/api/src`, and exported shared types from `packages/shared-types/src/index.ts`. Prefer 2-space indentation, descriptive camelCase variables/functions, PascalCase React components/classes/types, and kebab-case route directories where applicable. Use Tailwind utility classes in the web app and keep server-side database access and auth logic in API services/modules.

## Testing Guidelines

There is currently no committed test runner or `npm test` script. Before opening changes, run `npm run lint` and `npm run build`. When adding tests, place frontend tests near the related component or route, API tests beside the relevant NestJS module, and name files with `.spec.ts` or `.test.ts`. Add workspace scripts so Turbo can run them consistently.

## Commit & Pull Request Guidelines

Recent history uses Conventional Commits, often scoped by workspace, such as `feat: implement JWT authentication and role-based access control`, `fix(web): resolve all lint errors`, and `fix(web): remove empty pages and URL from print output`. Use `feat`, `fix`, `docs`, `refactor`, or `chore`, and include a scope when useful.

Pull requests should include a short summary, affected areas, validation commands run, linked issues or specs, and screenshots for UI changes. Note any database migration or seed-data impact explicitly.

## Security & Configuration Tips

Do not commit `.env` files or secrets. Minimum local variables are documented in `README.md`: `apps/api/.env` needs database, Redis, JWT, and port settings; `apps/web/.env.local` needs `NEXT_PUBLIC_API_URL`.
