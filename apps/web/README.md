# BikeMasters WMS — Web

Next.js 14 frontend for the BikeMasters Workshop Management System.

## Development

```bash
npm run dev     # Start dev server on port 3000
npm run build   # Production build
npm run lint    # ESLint
```

## Routes

| Route | Description |
|---|---|
| `/` | Main dashboard — job card queue, search, statistics |
| `/estimation/[jobCardId]` | Estimation & invoice page for a job card |

## Environment

Create `apps/web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

See the [root README](../../README.md) for full setup instructions.
