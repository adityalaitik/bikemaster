# BikeMaster WMS — Database (`db1/`)

This folder is the **single source of truth** for the BikeMaster MySQL database.  
Every developer on the team syncs their local DB from these files.

---

## Folder Structure

```
db1/
├── schema/
│   └── schema.sql              ← Full DDL — all 47 tables (AUTO-GENERATED, do not edit)
├── seeds/
│   ├── seed_master.sql         ← Reference/lookup data (AUTO-GENERATED)
│   └── seed_transactional.sql  ← Operational data — customers, jobs, invoices (AUTO-GENERATED)
├── dcl/
│   └── permissions.sql         ← CREATE USER + GRANT statements (run as root once)
├── scripts/
│   ├── setup.sh                ← First-time setup (new developer)
│   ├── apply.sh                ← Sync after pulling schema changes
│   ├── reset.sh                ← DESTRUCTIVE: full drop + rebuild
│   └── dump.sh                 ← Snapshot live DB back into this folder
└── README.md                   ← You are here
```

> **Rule:** Never edit `schema.sql`, `seed_master.sql`, or `seed_transactional.sql` by hand.  
> Make changes in MySQL → run `dump.sh` → commit the regenerated files.

---

## Quick-start (new developer)

### Prerequisites
- MySQL 8.0+ running locally (default port 3306)
- Root access to MySQL (needed once to create the `admin` user)
- `mysqldump` + `mysql` CLI in your `$PATH`

### Steps

```bash
# 1. Clone the repo
git clone <repo-url>
cd bikemaster

# 2. (First time only) Create the DB user and load everything
chmod +x db1/scripts/setup.sh
./db1/scripts/setup.sh
# → prompts for MySQL root password if MYSQL_ROOT_PASS is not set

# 3. Start the apps
npm install
npm run dev
```

That's it. The API runs on **http://localhost:4000** and the web on **http://localhost:3000**.

---

## Day-to-day Workflows

### After pulling someone else's schema change

```bash
./db1/scripts/apply.sh
```

Safe — uses `INSERT IGNORE`, will not overwrite your local data.

### After changing the schema yourself

```bash
# 1. Make the change in MySQL (via TypeORM entity or direct SQL)
# 2. Capture it
./db1/scripts/dump.sh

# 3. Commit the updated files
git add db1/schema/schema.sql db1/seeds/
git commit -m "db: <describe schema change>"
```

### Full reset (wipe + reload from scratch)

```bash
./db1/scripts/reset.sh
# Type 'yes' when prompted — ALL DATA WILL BE LOST
```

---

## Connection Details

| Property   | Value                  |
|------------|------------------------|
| Host       | `localhost`            |
| Port       | `3306`                 |
| Database   | `bikemaster`           |
| User       | `admin`                |
| Password   | `LeOmm@8769`           |
| Charset    | `utf8mb4_unicode_ci`   |

Override via environment variables: `MYSQL_USER`, `MYSQL_PASS`, `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DB`.

---

## Database Layout (47 tables)

### Multi-tenancy

| Table                    | Description                                      |
|--------------------------|--------------------------------------------------|
| `organizations`          | Top-level org (one per deployment)               |
| `garages`                | Workshop branches — BBR-001, PTI-003             |

### Users & Access

| Table                    | Description                                      |
|--------------------------|--------------------------------------------------|
| `users`                  | Login accounts (7 roles, see below)              |
| `user_garage_assignments`| Many-to-many: which user can access which branch |
| `employees`              | Technicians / advisors / staff per garage        |
| `designations`           | Job titles (per garage)                          |

**User roles:** `super_admin`, `org_admin`, `garage_manager`, `service_advisor`, `technician`, `cashier`, `viewer`

### Vehicles & Customers

| Table              | Description                                  |
|--------------------|----------------------------------------------|
| `customers`        | Customer records                             |
| `vehicles`         | Vehicle registry (reg no, chassis, engine)   |
| `customer_vehicles`| Customer ↔ vehicle ownership link           |
| `vehicle_brands`   | Honda, TVS, Bajaj, etc.                      |
| `vehicle_models`   | Activa 6G, Jupiter 125, etc.                 |
| `vehicle_variants` | Disc, Drum, Deluxe, etc.                     |
| `vehicle_categories`| Scooter, Motorcycle, Electric Scooter       |

### Service Workflow

| Table                 | Description                                      |
|-----------------------|--------------------------------------------------|
| `job_cards`           | Core work order — one per vehicle visit          |
| `job_complaints`      | Customer-reported problems on a job card         |
| `job_card_technicians`| Technician assignments per job card              |
| `job_card_images`     | Photo evidence (before/after)                    |
| `vehicle_inspections` | Pre-service checklist JSON                       |

### Estimation

| Table             | Description                             |
|-------------------|-----------------------------------------|
| `job_spare_items` | Spare parts used on a job card          |
| `job_service_items`| Labour services billed on a job card   |

### Inventory

| Table                   | Description                                  |
|-------------------------|----------------------------------------------|
| `spare_parts`           | Parts catalogue per garage                   |
| `spare_brands`          | Spare part manufacturers                     |
| `inventory_batches`     | Stock batches with purchase price & expiry   |
| `inventory_transactions`| Stock in/out ledger                          |
| `vendors`               | Suppliers                                    |
| `purchase_orders`       | PO headers                                   |
| `purchase_order_items`  | PO line items                                |
| `salvages`              | Write-offs                                   |

### Financial

| Table       | Description                             |
|-------------|-----------------------------------------|
| `invoices`  | Tax invoices (linked to job cards)      |
| `payments`  | Payment receipts                        |
| `discounts` | Discount records                        |
| `tax_rates` | GST rate config (default 18%)           |

### Insurance

| Table                | Description                        |
|----------------------|------------------------------------|
| `vehicle_insurance`  | Insurance policy per vehicle       |
| `insurance_claims`   | Claims against a policy            |
| `insurance_providers`| Insurance company registry         |

### Services & Packages

| Table          | Description                                |
|----------------|--------------------------------------------|
| `services`     | Service catalogue per garage               |
| `packages`     | Bundle packages (e.g. Annual Tune-up)      |
| `package_items`| Items inside each package                  |
| `offers`       | Discount offers / promotions per garage    |
| `sold_packages`| Packages sold to customers                 |

### CRM & Comms

| Table               | Description                             |
|---------------------|-----------------------------------------|
| `customer_sources`  | Where customers came from (Walk-in, etc.)|
| `crm_followups`     | Scheduled follow-up calls               |
| `notifications`     | In-app notifications                    |
| `message_templates` | SMS/WhatsApp template library           |

### Counter Sales

| Table               | Description                      |
|---------------------|----------------------------------|
| `counter_sales`     | OTC (over-the-counter) sales     |
| `counter_sale_items`| Line items on counter sales      |

### Audit

| Table        | Description              |
|--------------|--------------------------|
| `audit_logs` | Change history log       |

---

## Branch (Garage) Seed Data

Two branches are seeded. All garage-scoped data is isolated by `garage_id`.

| Branch             | Code    | Garage ID                              |
|--------------------|---------|----------------------------------------|
| Bhubaneswar Branch | BBR-001 | `11111111-1111-1111-1111-111111111111` |
| Patia Branch       | PTI-003 | `33333333-3333-3333-3333-000000000001` |

### Demo Login Credentials

| Username       | Password     | Role             | Branch      |
|----------------|--------------|------------------|-------------|
| `admin`        | `admin123`   | Super Admin      | Both        |
| `manager`      | `manager123` | Garage Manager   | BBR-001     |
| `advisor`      | `advisor123` | Service Advisor  | BBR-001     |
| `tech`         | `tech123`    | Technician       | BBR-001     |
| `cashier`      | `cashier123` | Cashier          | BBR-001     |
| `manager.ptia` | `manager123` | Garage Manager   | PTI-003     |
| `advisor.ptia` | `advisor123` | Service Advisor  | PTI-003     |
| `tech.ptia`    | `tech123`    | Technician       | PTI-003     |
| `cashier.ptia` | `cashier123` | Cashier          | PTI-003     |

> Credentials are defined in `apps/api/src/auth/auth.service.ts` (`DEMO_USERS`).  
> The `users` table stores the same accounts; password hashes are bcrypt.

---

## Tenant Isolation (Important)

MySQL has **no row-level security**. Multi-branch isolation is enforced 100% in the NestJS application layer.

**Every** query against a garage-scoped table **must** include:
```sql
WHERE garage_id = :garageId
```

The `garageId` is extracted from the authenticated JWT and injected into every service method.  
See `apps/api/src/auth/` for the guard implementation.

Tables that require `garage_id` filtering:
`garages`, `employees`, `designations`, `customers`, `customer_sources`, `vehicle_categories`,
`job_cards`, `job_complaints`, `spare_parts`, `inventory_batches`, `inventory_transactions`,
`services`, `packages`, `sold_packages`, `job_spare_items`, `job_service_items`, `invoices`,
`payments`, `offers`

---

## Schema Change Process

1. Modify the TypeORM entity in `apps/api/src/entities/`  
   (`synchronize: false` — TypeORM will NOT auto-migrate)
2. Apply the change to your local DB directly via SQL or migration
3. `./db1/scripts/dump.sh` — regenerates all three files
4. `git add db1/` and commit — teammates sync with `apply.sh`

---

## Environment Variables

All scripts respect these env vars (defaults shown):

| Variable           | Default        | Description         |
|--------------------|----------------|---------------------|
| `MYSQL_USER`       | `admin`        | DB user             |
| `MYSQL_PASS`       | `LeOmm@8769`   | DB password         |
| `MYSQL_HOST`       | `localhost`    | MySQL host          |
| `MYSQL_PORT`       | `3306`         | MySQL port          |
| `MYSQL_DB`         | `bikemaster`   | Database name       |
| `MYSQL_ROOT_USER`  | `root`         | Root user (setup only)|
| `MYSQL_ROOT_PASS`  | _(blank)_      | Root password (setup only)|

Example — use a different host:
```bash
MYSQL_HOST=db.internal MYSQL_PORT=3307 ./db1/scripts/apply.sh
```
