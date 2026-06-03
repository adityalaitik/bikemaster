# Database — BikeMasters WMS

MySQL 8.x. The `db/` folder is the single source of truth for schema and seed data.

---

## First time setup (after cloning)

Make sure MySQL is running, then:

```bash
npm run db:setup
```

That's it. This will:
- Create the `bikemaster` database
- Create the `admin` user
- Load all tables from `schema/schema.sql`
- Load all reference data from `seeds/seed_data.sql`

If your MySQL root user has a password:

```bash
MYSQL_ROOT_PASS=yourpassword npm run db:setup
```

---

## Pulled new changes and schema changed?

```bash
npm run db:apply
```

Applies the updated `schema.sql` to your existing DB. Existing rows are preserved — seed inserts use `INSERT IGNORE`.

---

## Folder structure

```
db/
  schema/
    schema.sql          ← AUTO-GENERATED — full DDL for all tables (source of truth)
    ddl_create.sql      ← original hand-written DDL (kept for reference)
    migration_*.sql     ← incremental migrations (applied manually)
  seeds/
    seed_data.sql       ← AUTO-GENERATED — master reference data (brands, services, parts, users…)
  scripts/
    setup.sh            ← first-time setup: create DB + user + schema + seeds
    dump.sh             ← capture live DB → update schema.sql + seed_data.sql
    apply.sh            ← apply schema.sql + seeds to existing DB (safe, no data loss)
    reset.sh            ← DESTRUCTIVE: drop everything and rebuild from scratch
```

---

## Workflow for schema changes

1. Make the change in MySQL (via the API or directly in the DB)
2. Run `npm run db:dump` — updates `schema.sql` and `seed_data.sql` automatically
3. Commit both files — other devs get the change on next `npm run db:apply`

```bash
# After any ALTER TABLE / CREATE TABLE / DROP TABLE:
npm run db:dump
git add db/schema/schema.sql db/seeds/seed_data.sql
git commit -m "db: update schema for <your change>"
git push
```

---

## Full reset (nuclear option)

Wipes the DB and rebuilds everything from the committed scripts:

```bash
npm run db:reset
```

---

## Connection details

| Key      | Value            |
|----------|-----------------|
| Host     | localhost        |
| Port     | 3306             |
| Database | bikemaster       |
| User     | admin            |
| Password | LeOmm@8769       |
