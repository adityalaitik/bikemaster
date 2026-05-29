# Deployment Checklist

Follow these steps in order.

## 1. Commit Latest Changes

```bash
git add .
git commit -m "prepare deployment config"
git push
```

## 2. Deploy API on Railway

1. Create a Railway project from the GitHub repo.
2. Add a Node service for `apps/api`.
3. Use these commands:

```bash
npm install && npm run build --workspace=apps/api
npm run start:prod --workspace=apps/api
```

## 3. Add Railway Databases

In the same Railway project, add:

- PostgreSQL
- Redis

Copy their connection URLs for the next step.

## 4. Set API Environment Variables

In the Railway API service, set:

```env
DATABASE_URL=your_railway_postgres_url
REDIS_URL=your_railway_redis_url
JWT_SECRET=replace-with-a-long-random-secret
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

Do not set `PORT` unless Railway asks for it.

## 5. Initialize PostgreSQL

Run locally after Railway PostgreSQL is ready:

```bash
psql "your_railway_postgres_url" -f db/schema/ddl_create.sql
psql "your_railway_postgres_url" -f db/dml/seed_data.sql
psql "your_railway_postgres_url" -f db/dcl/permissions.sql
```

## 6. Verify API

Open:

```txt
https://your-railway-api-url/api-docs
```

## 7. Deploy Frontend on Vercel

1. Import the GitHub repo in Vercel.
2. Keep the project root as the repository root.
3. Deploy. `vercel.json` handles the frontend build.

## 8. Set Vercel Environment Variable

In Vercel project settings, set:

```env
NEXT_PUBLIC_API_URL=https://your-railway-api-url
```

Redeploy the Vercel project.

## 9. Update API CORS

After Vercel gives the final frontend URL, update Railway:

```env
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

Redeploy the Railway API service.

## 10. Final Test

Confirm:

- Frontend opens on Vercel.
- API docs open at `/api-docs`.
- Login works.
- Job cards load.
- Browser console has no CORS errors.

Demo logins:

```txt
manager / manager123
advisor / advisor123
tech / tech123
```
