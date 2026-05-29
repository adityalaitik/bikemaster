# Spec 1: Project Setup

## Description
Setup Turborepo monorepo with:
- apps/web (Next.js 14, TypeScript, Tailwind, shadcn/ui, next-themes)
- apps/api (NestJS, TypeScript, Prisma, PostgreSQL)
- packages/shared-types
- Docker Compose (postgres, redis)
- Environment config (.env.example)
- ESLint + Prettier across workspace
- Husky + lint-staged pre-commit hooks
